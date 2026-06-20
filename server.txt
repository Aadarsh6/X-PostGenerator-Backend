import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: [
    'https://x-post-generator-ruby.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5;

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of requestCounts.entries()) {
    const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
    if (recentRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, recentRequests);
    }
  }
}, RATE_LIMIT_WINDOW);

const rateLimitMiddleware = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, []);
  }
  
  const requests = requestCounts.get(clientIp);
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait before making another request.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }
  
  recentRequests.push(now);
  requestCounts.set(clientIp, recentRequests);
  
  next();
};

// Helper functions
const getPostCount = (PostType) => {
  const counts = {
    'single': 1,
    'thread': Math.floor(Math.random() * 4) + 2,
    'long-thread': Math.floor(Math.random() * 5) + 6
  };
  return counts[PostType] || 1;
};

// FIXED: Updated prompt creation with correct numbering
const createOptimizedPrompt = (prompt, tone, postCount, PostType) => {
  // Calculate correct numbering values
  const totalNumberedPosts = PostType !== 'single' ? postCount - 1 : 0;
  
  const toneInstructions = {
    'professional': 'Use an authoritative, expert tone with industry-specific insights, data-driven points, and executive-level perspective. Sound like a seasoned professional sharing hard-won expertise.',
    'humorous': 'Use sharp humor, clever observations, and unexpected angles. Make people smile while delivering genuine insights. Balance entertainment with education through wordplay and irony.',
    'educational': 'Break down complex topics into simple, digestible concepts. Use analogies, step-by-step explanations, and real-world examples. Teach genuinely useful knowledge that people can immediately understand and apply.',
    'controversial': 'Challenge popular beliefs with provocative, well-reasoned alternative viewpoints. Present uncomfortable truths and counterintuitive insights that make people question their assumptions.',
    'casual': 'Use a friendly, conversational tone like talking to a close friend. Include relatable examples, personal observations, and everyday language that makes complex topics feel accessible.',
    'inspirational': 'Use powerful, motivational language that ignites action. Include transformative mindset shifts, empowering beliefs, and calls to greatness. Make people feel capable of achieving more.',
  };

  const typeInstructions = {
    'single': 'Create ONE high-impact post that delivers complete value in 240-270 characters.',
    'thread': `Create a ${postCount}-post thread that builds a complete narrative with each post adding value.`,
    'long-thread': `Create a comprehensive ${postCount}-post thread that thoroughly explores the topic with deep insights.`
  };

  return `Create ${PostType === 'single' ? 'a single post' : `a ${postCount}-post thread`} about: "${prompt}"

TONE: ${toneInstructions[tone] || toneInstructions.professional}
FORMAT: ${typeInstructions[PostType]}

CRITICAL REQUIREMENTS:
- ${tone.toUpperCase()} tone throughout
- Focus on actionable insights about: ${prompt}
- Each post must be under 280 characters
- Provide immediate value that makes people want to bookmark
- Sound like a knowledgeable human sharing genuine wisdom
- No fabricated claims or fake authority
- No AI-speak or corporate buzzwords
- STRICTLY FORBIDDEN: Do not use double dashes (--) anywhere in the text
- Use periods, commas, for punctuation instead

${PostType !== 'single' ? `
THREAD STRUCTURE & NUMBERING:
- Post 1: Strong hook that promises value + thread indicator emoji (🧵 or ⬇️ or 👇) - NO NUMBERING
- Posts 2-${postCount}: Numbered insights (1/${totalNumberedPosts}, 2/${totalNumberedPosts}, etc.) that build on each other
- Each post must flow naturally to the next
- Use transitional phrases to maintain connection
- CRITICAL: Post 1 must end with a thread indicator emoji to signal this is a thread
- CRITICAL: Final numbered post (${totalNumberedPosts}/${totalNumberedPosts}) must include a specific, actionable next step
- CRITICAL: If you cannot generate ${postCount} posts with original, valuable content, return an error message instead of using generic fallbacks

NUMBERING VALIDATION:
- Hook post (Post 1): NO numbering at all
- Numbered posts: Start from 1/${totalNumberedPosts} and end at ${totalNumberedPosts}/${totalNumberedPosts}
- ALL numbered posts must use the same denominator: ${totalNumberedPosts}
- Example sequence: Post 1 (no number), Post 2 (1/${totalNumberedPosts}), Post 3 (2/${totalNumberedPosts}), ..., Post ${postCount} (${totalNumberedPosts}/${totalNumberedPosts})
` : ''}

CONTENT VALIDATION CHECKLIST:
- Is this specific enough to provide genuine value?
- Does each post contain actionable insights?
- Are all posts consistent with the chosen tone?
- Is the numbering system consistent throughout (all using /${totalNumberedPosts})?
- Does the final post provide a clear, specific next step?
- Are you avoiding all prohibited phrases and AI-speak?

ERROR HANDLING:
If you cannot generate original, valuable content for all ${postCount} posts, return this exact error response:
{
  "error": "Unable to generate ${postCount} posts with original insights for this topic. Please try a more specific prompt or different angle.",
  "suggestion": "Consider narrowing your focus or providing more context about your target audience."
}

Return the response in this exact JSON format:
${PostType === 'single' ? 
`{
  "content": "the complete post content",
  "characterCount": actual_number,
  "valueProposition": "specific value provided",
  "actionableElement": "what reader does next"
}` :
`[
  {
    "content": "post content (hook with thread indicator emoji - NO numbering anywhere)",
    "characterCount": actual_number,
    "postNumber": 1,
    "coreInsight": "main insight of this post",
    "actionableElement": "specific action or takeaway"
  },
  {
    "content": "post content with numbering (1/${totalNumberedPosts})",
    "characterCount": actual_number,
    "postNumber": 2,
    "coreInsight": "builds on previous insight",
    "actionableElement": "next step or application"
  },
  {
    "content": "post content with final numbering (${totalNumberedPosts}/${totalNumberedPosts}) + specific next action",
    "characterCount": actual_number,
    "postNumber": ${postCount},
    "coreInsight": "final key insight",
    "actionableElement": "clear, specific action to take immediately"
  }
]`}`;
};

// Enhanced system prompt with better structure and stricter controls
const TWITTER_CONTENT_STRATEGIST = `You are an elite content strategist who creates Twitter/X posts that feel genuinely human-written and provide exceptional, bookmark-worthy value.

🎯 CORE MISSION: Create authentic, insight-rich content that reads like it came from a genuinely knowledgeable person sharing hard-earned wisdom that users will want to save and reference.

🚫 ABSOLUTE PROHIBITIONS (ZERO TOLERANCE):
• NO double dashes (--) anywhere in the text - use periods, commas only
• NO false authority claims or fabricated personal stories
• NO generic AI phrases: "game-changer", "unlock", "dive deep", "let's dive in", "here's the thing"
• NO fake statistics or made-up numbers
• NO corporate buzzwords or marketing speak
• NO excessive emojis (max 2 per post)
• NO markdown formatting (**, __, etc.)
• NO vague advice - everything must be specific and actionable
• NO fake citations like [1], [2], [3] - only include real, verifiable sources if any
• NO fallback templates or generic responses
• NO phrases like "Most people don't realize", "The truth is", "Here's what I learned"
• NO ending posts with "Complexity is the enemy of execution" or similar generic statements

🔢 THREAD NUMBERING SYSTEM (CRITICAL - FIXED):
• Post 1: Hook only (NO numbering - completely clean)
• Posts 2 through N: Use format "1/X, 2/X, 3/X" where X = total numbered posts (postCount - 1)
• Example for 6-post thread: Post 1 (no number), Post 2 (1/5), Post 3 (2/5), Post 4 (3/5), Post 5 (4/5), Post 6 (5/5)
• NEVER include the hook post in your denominator calculation
• The denominator must be consistent throughout ALL numbered posts
• Final numbered post must end with a specific, actionable next step

NUMBERING VALIDATION RULES:
• Hook post: Zero numbers, zero fractions - just content + thread emoji
• First numbered post: Always starts with "1/X"
• Last numbered post: Always ends with "X/X" where X is the same throughout
• All denominators must match exactly
• No skipped numbers in sequence

⚠️ CONTENT QUALITY ENFORCEMENT:
If you cannot generate original, valuable insights for the full requested thread length:
- DO NOT use fallback templates
- DO NOT create generic final posts
- DO NOT pad threads with low-value content
- INSTEAD: Return an error message asking for a more specific prompt

✅ BOOKMARK-WORTHY STANDARDS:
• Write like a thoughtful expert sharing genuine insights
• Use universal truths and observable patterns
• Share frameworks based on proven principles
• Make every word count - no fluff, no filler
• Provide immediate, actionable value that can be applied today
• Use specific, concrete examples people can relate to
• Write with conviction but without arrogance
• Include counter-intuitive insights that challenge common thinking

📝 WRITING STYLE GUIDE:
• Short, punchy sentences with natural flow
• Conversational but intelligent tone
• Direct and to the point
• Use "you" to make it personal
• Vary sentence length for readability
• End with actionable advice
• Use active voice over passive voice
• Replace all double dashes with periods or single dashes
• Avoid overused transition words and phrases

🔥 SINGLE POST STRUCTURE (240-270 characters):
1. HOOK (40-60 chars): Strong opening that stops scrolling
2. CONTEXT (60-80 chars): Why this matters right now
3. INSIGHT (80-100 chars): The core realization or framework
4. ACTION (40-60 chars): What to do immediately

🧵 THREAD STRUCTURE (2+ posts):
POST 1: Hook + Promise of specific value coming (NO NUMBERING) + Thread indicator emoji
POSTS 2-N: Numbered insights with seamless flow
- Use consistent numbering: 1/X, 2/X, 3/X (where X = number of numbered posts)
- Each post must contain unique, actionable insight
- Build logically from one post to the next
- Final numbered post should include clear next step

THREAD INDICATOR REQUIREMENTS:
• Post 1 (hook) must end with one of these thread indicators: 🧵 or ⬇️ or 👇
• Choose the emoji that best fits the tone and character count
• The emoji should signal to users that this is a thread
• Place the emoji at the very end of the hook post
• Example: "Here's how to validate your startup idea without spending $1000 🧵"

CRITICAL THREAD REQUIREMENTS:
• Post 1 serves as the hook and setup - it gets NO number but MUST include thread indicator emoji
• Numbered posts start from post 2 using format "1/X"
• If you promise a specific number of insights, deliver exactly that many
• Never use generic conclusions or fallback responses
• Every post must provide distinct value
• Complete the entire promised framework

💡 VALUE DELIVERY FRAMEWORK (MUST INCLUDE ALL):
Every post MUST deliver:
1. IMMEDIATE INSIGHT: Something they can understand and apply right now
2. PRACTICAL APPLICATION: Specific steps they can take today
3. MEASURABLE BENEFIT: Clear outcome they'll achieve
4. REFERENCE VALUE: Information they'll want to revisit
5. COUNTER-INTUITIVE ELEMENT: Something that challenges conventional thinking

📊 OUTPUT REQUIREMENTS:
Return valid JSON format exactly as specified in the user prompt.
If unable to generate quality content, return error message as specified.

🔍 QUALITY VALIDATION CHECKLIST:
Before finalizing, ensure:
- Zero double dashes (--) in any content
- Sounds like a knowledgeable human wrote it
- Zero fabricated claims or fake authority
- Provides genuine, actionable value
- Flows naturally without AI-speak
- Every word serves a purpose
- Contains specific, implementable advice
- Includes insights worth bookmarking
- No fake citations or reference numbers
- Thread numbering is mathematically consistent
- No generic fallback responses or templates
- Each post provides distinct, valuable insight
- Final post includes clear action step (not generic statement)

⚡ ENGAGEMENT OPTIMIZATION:
- Start with a strong, relatable hook
- Use pattern interrupts to maintain attention
- Include surprising statistics or insights (only if verifiable)
- End with a clear call to action
- Make it shareable and quotable
- Build genuine curiosity for the next post

🚨 ERROR HANDLING:
If the prompt is too vague or you cannot generate original insights:
- Return error message as specified in prompt
- DO NOT create generic content to fill space
- DO NOT use fallback templates
- DO NOT make up insights to reach post count

Remember: Quality over quantity. Better to return an error than to create generic, valueless content that contradicts your core mission of providing bookmark-worthy insights.

FINAL VALIDATION:
Each post must pass this test: "Would I personally bookmark this for future reference?" If not, revise or return an error.`;

// Enhanced post generation with better error handling
const generatePosts = async (prompt, tone, PostType, retryCount = 0) => {
  const MAX_RETRIES = 2;
  
  console.log(`Making request to Perplexity API (attempt ${retryCount + 1})...`);
  
  const postCount = getPostCount(PostType);
  const optimizedPrompt = createOptimizedPrompt(prompt, tone, postCount, PostType);
  
  const requestBody = {
    model: "sonar-pro",
    messages: [
      {
        role: "system",
        content: TWITTER_CONTENT_STRATEGIST
      },
      {
        role: "user",
        content: optimizedPrompt
      }
    ],
    temperature: 0.7,
    max_tokens: PostType === 'long-thread' ? 1500 : 900
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }
    
    return {
      content: data.choices[0].message.content.trim(),
      expectedCount: postCount
    };
    
  } catch (error) {
    console.error(`API call failed (attempt ${retryCount + 1}):`, error.message);
    
    // Retry logic
    if (retryCount < MAX_RETRIES && !error.message.includes('401')) {
      console.log(`Retrying in ${(retryCount + 1) * 1000}ms...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
      return generatePosts(prompt, tone, PostType, retryCount + 1);
    }
    
    throw error;
  }
};

// FIXED: Enhanced fallback system with correct numbering
const createAuthenticFallback = (topic, index, total, PostType) => {
  // Calculate correct numbering for fallback
  const totalNumberedPosts = PostType !== 'single' ? total - 1 : 0;
  const isHookPost = index === 0;
  const threadPrefix = (!isHookPost && PostType !== 'single') ? `${index}/${totalNumberedPosts} ` : '';
  
  const templates = [
    {
      pattern: "practical_insight",
      template: `${threadPrefix}Most people overcomplicate ${topic}.\n\nThe truth: Simple systems beat complex ones.\n\nStart with one clear goal, one daily action, one weekly review.\n\nComplexity is the enemy of execution.`
    },
    {
      pattern: "actionable_wisdom",
      template: `${threadPrefix}The ${topic} advice nobody talks about:\n\nStop optimizing. Start doing.\n\n• Perfect plans fail\n• Imperfect action wins\n• Consistency beats intensity\n\nProgress over perfection, always.`
    },
    {
      pattern: "mindset_shift",
      template: `${threadPrefix}${topic} mindset shift:\n\nFrom: "I need more tools"\nTo: "I need better habits"\n\nThe best system is the one you actually use.\n\nStart simple. Stay consistent.`
    }
  ];
  
  let template = templates[index % templates.length];
  
  // For hook post, remove numbering and add thread emoji
  if (isHookPost && PostType !== 'single') {
    template = {
      pattern: "hook",
      template: `Struggling with ${topic}? Here's a step-by-step breakdown with real examples and actionable tips 🧵`
    };
  }
  
  return {
    content: template.template,
    characterCount: template.template.length,
    postNumber: index + 1,
    coreInsight: template.pattern,
    actionableElement: "immediate implementation",
    authentic: true,
    fallback: true,
    message: "This is a fallback response - please try again for original, high-value content"
  };
};

// NEW: Post-processing validation function
function validateThreadNumbering(posts, expectedPostCount) {
  if (posts.length !== expectedPostCount) {
    throw new Error(`Expected ${expectedPostCount} posts, got ${posts.length}`);
  }
  
  const totalNumberedPosts = expectedPostCount - 1;
  
  // Validate hook post (first post)
  const hookPost = posts[0];
  if (hookPost.content.match(/\d+\/\d+/)) {
    throw new Error("Hook post contains numbering - should be clean");
  }
  if (!hookPost.content.match(/[🧵⬇️👇]$/)) {
    console.warn("Hook post missing thread indicator emoji");
  }
  
  // Validate numbered posts
  for (let i = 1; i < posts.length; i++) {
    const post = posts[i];
    const expectedNumber = `${i}/${totalNumberedPosts}`;
    
    if (!post.content.includes(expectedNumber)) {
      throw new Error(`Post ${i + 1} should contain "${expectedNumber}", but doesn't`);
    }
  }
  
  // Validate final post has actionable element
  const finalPost = posts[posts.length - 1];
  if (!finalPost.actionableElement || finalPost.actionableElement.length < 10) {
    console.warn("Final post lacks specific actionable element");
  }
  
  return true;
}

// NEW: Helper function to clean any accidental numbering from hook post
function cleanHookPost(content) {
  return content.replace(/^\d+\/\d+\s*/, '').trim();
}

// NEW: Force-fix numbering in AI responses
function fixNumberingInPosts(posts, expectedCount) {
  const totalNumberedPosts = expectedCount - 1;
  
  return posts.map((post, index) => {
    if (index === 0) {
      // Hook post - remove any accidental numbering
      post.content = post.content.replace(/^\d+\/\d+\s*/, '').trim();
      return post;
    }
    
    // Numbered posts - fix the numbering
    const correctNumber = `${index}/${totalNumberedPosts}`;
    
    // Remove any existing numbering pattern
    let content = post.content.replace(/^\d+\/\d+\s*/, '').trim();
    
    // Add correct numbering
    post.content = `${correctNumber} ${content}`;
    
    return post;
  });
}

// Enhanced content trimming
const intelligentTrim = (content, maxLength = 270) => {
  if (content.length <= maxLength) return content;
  
  // Try to cut at sentence boundary
  const sentences = content.split(/[.!?]+/);
  let trimmed = '';
  
  for (const sentence of sentences) {
    const nextLength = (trimmed + sentence + '.').length;
    if (nextLength <= maxLength - 3) {
      trimmed += sentence + '.';
    } else {
      break;
    }
  }
  
  // If no complete sentences fit, cut at word boundary
  if (trimmed.length < maxLength * 0.7) {
    const words = content.split(' ');
    trimmed = '';
    
    for (const word of words) {
      const nextLength = (trimmed + (trimmed ? ' ' : '') + word).length;
      if (nextLength <= maxLength - 3) {
        trimmed += (trimmed ? ' ' : '') + word;
      } else {
        break;
      }
    }
  }
  
  return trimmed.length > 0 ? trimmed + '...' : content.substring(0, maxLength - 3) + '...';
};

// Input validation middleware
const validateInput = (req, res, next) => {
  const { prompt, tone, PostType } = req.body;
  
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required and must be a non-empty string'
    });
  }
  
  if (prompt.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Prompt must be less than 500 characters'
    });
  }
  
  const validTones = ['professional', 'humorous', 'educational', 'controversial', 'casual', 'inspirational'];
  if (!tone || !validTones.includes(tone)) {
    return res.status(400).json({
      success: false,
      error: `Invalid tone. Must be one of: ${validTones.join(', ')}`
    });
  }
  
  const validPostTypes = ['single', 'thread', 'long-thread'];
  if (!PostType || !validPostTypes.includes(PostType)) {
    return res.status(400).json({
      success: false,
      error: `Invalid PostType. Must be one of: ${validPostTypes.join(', ')}`
    });
  }
  
  next();
};

// UPDATED: Main API endpoint with validation and force-fix
app.post('/api/generate-post', rateLimitMiddleware, validateInput, async (req, res) => {
  try {
    const { prompt, tone, PostType } = req.body;

    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API service temporarily unavailable'
      });
    }

    console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

    let parsedPosts;
    const expectedCount = getPostCount(PostType);

    try {
      const aiResult = await generatePosts(prompt, tone, PostType);
      const { content: aiResponse } = aiResult;
      
      // Clean and parse AI response
      const cleanedResponse = aiResponse
        .replace(/``````/g, '')
        .replace(/``````/g, '')
        .replace(/^[^[{]*/, '')
        .replace(/[^}\]]*$/, '')
        .trim();
      
      parsedPosts = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(parsedPosts)) {
        parsedPosts = [parsedPosts];
      }
      
      // NEW: Force-fix numbering regardless of what AI generated
      if (PostType !== 'single') {
        parsedPosts = fixNumberingInPosts(parsedPosts, expectedCount);
        console.log('🔧 Numbering force-corrected');
      }
      
      console.log('✅ AI generation successful');
      
    } catch (aiError) {
      console.warn('AI generation failed, using authentic fallback:', aiError.message);
      
      // Use high-quality authentic fallback
      parsedPosts = Array.from({ length: expectedCount }, (_, i) => 
        createAuthenticFallback(prompt, i, expectedCount, PostType)
      );
    }

    // Ensure correct post count
    if (parsedPosts.length !== expectedCount) {
      if (parsedPosts.length < expectedCount) {
        const additionalPosts = expectedCount - parsedPosts.length;
        for (let i = 0; i < additionalPosts; i++) {
          parsedPosts.push(
            createAuthenticFallback(prompt, parsedPosts.length, expectedCount, PostType)
          );
        }
      } else {
        parsedPosts = parsedPosts.slice(0, expectedCount);
      }
    }

    // Validate numbering (should pass now)
    if (PostType !== 'single' && Array.isArray(parsedPosts)) {
      try {
        validateThreadNumbering(parsedPosts, expectedCount);
        console.log('✅ Thread numbering validated successfully');
      } catch (validationError) {
        console.error('❌ Numbering validation still failed:', validationError.message);
        // Force fix one more time
        parsedPosts = fixNumberingInPosts(parsedPosts, expectedCount);
        console.log('🔧 Applied emergency numbering fix');
      }
    }

    // Optimize content
    parsedPosts = parsedPosts.map((post, index) => {
      if (!post.content) {
        return createAuthenticFallback(prompt, index, expectedCount, PostType);
      }
      
      const originalLength = post.content.length;
      const optimizedContent = originalLength > 280 
        ? intelligentTrim(post.content, 270)
        : post.content;
      
      return {
        ...post,
        content: optimizedContent,
        characterCount: optimizedContent.length,
        withinLimit: optimizedContent.length <= 280,
        wasTruncated: originalLength > 280,
        originalLength: originalLength
      };
    });

    res.json({
      success: true,
      posts: parsedPosts,
      metadata: { 
        prompt, 
        tone, 
        PostType,
        expectedCount,
        actualCount: parsedPosts.length,
        totalNumberedPosts: PostType !== 'single' ? expectedCount - 1 : 0,
        model: 'sonar-pro',
        version: 'enhanced-v4-force-fixed',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate posts',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Test endpoint
app.get('/api/test-key', async (req, res) => {
  try {
    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: "Say hello" }],
        max_tokens: 10
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({
        success: false,
        error: 'API Key test failed',
        details: errorData
      });
    }

    const data = await response.json();
    res.json({
      success: true,
      message: 'API Key is working',
      response: data.choices?.[0]?.message?.content || 'No content'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'API Key test failed',
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'X Post Generator Backend',
    hasApiKey: !!process.env.PERPLEXITY_API_KEY,
    version: 'v4.0-numbering-fixed',
    features: [
      'Fixed thread numbering system',
      'Enhanced validation',
      'Force-fix numbering',
      'Improved rate limiting',
      'Better error handling',
      'Input validation',
      'Retry logic',
      'Request timeouts',
      'Memory cleanup'
    ],
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test-key',
      'POST /api/generate-post'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced X Post Generator running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-post`);
  console.log(`🔑 API Key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
  console.log(`🛡️ Rate limiting: ${RATE_LIMIT_MAX} requests per minute`);
  console.log(`✨ Features: Fixed Numbering, Security, Validation, Retry Logic, Timeouts`);
});

// Export for testing
export default app;
