import { env } from '../config/env.js';

export interface GeminiResponse {
  content: string;
  expectedCount: number;
}

interface GroqPost {
  content: string;
  coreInsight: string;
  actionableElement: string;
}

const SINGLE_POST_SCHEMA = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    characterCount: { type: 'integer' },
    valueProposition: { type: 'string' },
    actionableElement: { type: 'string' },
  },
  required: [
    'content',
    'characterCount',
    'valueProposition',
    'actionableElement',
  ],
  additionalProperties: false,
} as const;

const THREAD_SCHEMA = {
  type: 'object',
  properties: {
    posts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          coreInsight: { type: 'string' },
          actionableElement: { type: 'string' },
        },
        required: [
          'content',
          'coreInsight',
          'actionableElement',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['posts'],
  additionalProperties: false,
} as const;

export async function generateWithGemini(
  prompt: string,
  tone: string,
  PostType: string,
  optimizedPrompt: string,
  postCount: number,
  retryCount = 0,
): Promise<GeminiResponse> {
  const MAX_RETRIES = 2;
  const isSingle = PostType === 'single';
  const expectedCount = isSingle ? 1 : postCount;

  console.log(
    `Making request to Groq API (attempt ${retryCount + 1})...`,
  );

  const systemPrompt = `You are an expert Twitter/X content strategist.

Write useful, specific, human-sounding posts.

Rules:
- Never fabricate statistics, facts, names, or personal experiences.
- Avoid generic AI phrases, corporate buzzwords, and filler.
- Never use double dashes or em dashes.
- No markdown formatting inside post content.
- Maximum two emojis per post.
- Do not number posts inside their content.
- The backend handles numbering.
- Follow the requested character limits.
- Return only JSON matching the supplied schema.`;

  const userPrompt = isSingle
    ? `${optimizedPrompt}

Topic: ${prompt}
Tone: ${tone}

Return exactly one post using the required single-post JSON schema.
The content should follow the character limit in the instructions.
Do not return an array.`
    : `${optimizedPrompt}

Topic: ${prompt}
Tone: ${tone}

Return exactly ${postCount} posts in the required thread schema.
The posts array must contain exactly ${postCount} objects.
Post 1 must be a compelling hook ending with 🧵.
Middle posts must each explain one complete insight.
The last post must give one concrete action.
Do not number posts inside their content.
Do not omit posts or use ellipses.
Return an object containing the posts array, not a top-level array.`;

  const requestBody = {
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: isSingle ? 1500 : 5000,
    response_format: {
      type: 'json_schema' as const,
      json_schema: {
        name: isSingle ? 'single_post_response' : 'thread_response',
        strict: true,
        schema: isSingle ? SINGLE_POST_SCHEMA : THREAD_SCHEMA,
      },
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      45000,
    );

    let response: Response;

    try {
      response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorData = await response.text();

      console.error(
        `Groq API rejected the request: HTTP ${response.status}`,
      );
      console.error(`Groq error: ${errorData}`);

      const error = new Error(
        `Groq API error ${response.status}: ${errorData}`,
      ) as Error & { status?: number };

      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const content = choice?.message?.content;

    if (choice?.finish_reason === 'length') {
      throw new Error(
        'Groq response was truncated. Increase max_tokens or simplify the prompt.',
      );
    }

    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Groq returned an empty response.');
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Groq returned invalid JSON.');
    }

    if (isSingle) {
      const post = parsed as Record<string, unknown>;

      if (
        !post ||
        Array.isArray(post) ||
        typeof post.content !== 'string' ||
        typeof post.characterCount !== 'number' ||
        typeof post.valueProposition !== 'string' ||
        typeof post.actionableElement !== 'string'
      ) {
        throw new Error('Groq returned an invalid single-post structure.');
      }

      return {
        content: JSON.stringify(post),
        expectedCount: 1,
      };
    }

    const thread = parsed as { posts?: unknown };

    if (
      !thread ||
      !Array.isArray(thread.posts) ||
      !thread.posts.every(
        (post: unknown) => {
          if (!post || typeof post !== 'object') return false;

          const item = post as Record<string, unknown>;

          return (
            typeof item.content === 'string' &&
            typeof item.coreInsight === 'string' &&
            typeof item.actionableElement === 'string'
          );
        },
      )
    ) {
      throw new Error('Groq returned an invalid thread structure.');
    }

    if (thread.posts.length !== postCount) {
      throw new Error(
        `Expected ${postCount} posts but received ${thread.posts.length}.`,
      );
    }

    const posts = thread.posts as GroqPost[];

    // Remove accidental numbering generated by the model.
    const normalizedPosts = posts.map((post) => ({
      ...post,
      content: post.content
        .replace(/^\s*\d+\s*\/\s*\d+\s*/, '')
        .trim(),
    }));

    return {
      content: JSON.stringify(normalizedPosts),
      expectedCount: postCount,
    };
  } catch (err) {
    const error = err as Error & { status?: number };
    const status = error.status;

    console.error(
      `AI generation failed (attempt ${retryCount + 1}):`,
      error.message,
    );

    // Retry transient server errors, rate limits, and network failures.
    // Do not retry identical requests for ordinary client errors.
    const retryable =
      status === undefined ||
      status === 408 ||
      status === 429 ||
      (status >= 500 && status <= 599);

    if (retryCount < MAX_RETRIES && retryable) {
      const delay = (retryCount + 1) * 3000;

      console.log(`Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return generateWithGemini(
        prompt,
        tone,
        PostType,
        optimizedPrompt,
        postCount,
        retryCount + 1,
      );
    }

    throw err;
  }
}