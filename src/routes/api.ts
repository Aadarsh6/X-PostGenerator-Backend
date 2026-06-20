import { Router, type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { createOptimizedPrompt } from '../services/promptBuilder.js';
import { getPostCount } from '../utils/postCounter.js';
import { createAuthenticFallback } from '../utils/fallback.js';
import { intelligentTrim } from '../utils/trimmer.js';
import { validateThreadNumbering, fixNumberingInPosts } from '../utils/validator.js';
import type { Post } from '../types/index.js';
import { generateWithGemini } from '../services/gemeni.js';
import { validateInput } from '../middlewar/validateInput.js';

const router = Router();

router.post('/generate-post', validateInput, async (req: Request, res: Response) => {
  try {
    const { prompt, tone, PostType } = req.body;

    console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

    let parsedPosts: Post[] = [];
    const expectedCount = getPostCount(PostType);

    try {
      const optimizedPrompt = createOptimizedPrompt(prompt, tone, expectedCount, PostType);

      const aiResult = await generateWithGemini(prompt, tone, PostType, optimizedPrompt, expectedCount);
      const { content: aiResponse } = aiResult;

      const parsed: any = JSON.parse(aiResponse);

      // Always normalize into an array, regardless of shape
      parsedPosts = Array.isArray(parsed) ? parsed : [parsed];

      if (PostType !== 'single') {
        parsedPosts = fixNumberingInPosts(parsedPosts, expectedCount);
        console.log('🔧 Numbering force-corrected');
      }

      console.log('✅ AI generation successful');

    } catch (aiError) {
      console.warn('AI failed, using fallback:', aiError instanceof Error ? aiError.message : String(aiError));
      parsedPosts = Array.from({ length: expectedCount }, (_, i) =>
        createAuthenticFallback(prompt, i, expectedCount, PostType)
      );
    }

    // Safety net: guarantee parsedPosts is always an array before continuing
    if (!Array.isArray(parsedPosts)) {
      parsedPosts = [parsedPosts];
    }

    if (parsedPosts.length !== expectedCount) {
      if (parsedPosts.length < expectedCount) {
        for (let i = 0; i < expectedCount - parsedPosts.length; i++) {
          parsedPosts.push(createAuthenticFallback(prompt, parsedPosts.length, expectedCount, PostType));
        }
      } else {
        parsedPosts = parsedPosts.slice(0, expectedCount);
      }
    }

    if (PostType !== 'single') {
      try {
        validateThreadNumbering(parsedPosts, expectedCount);
        console.log('✅ Thread numbering validated');
      } catch (validationError) {
        console.error('❌ Validation failed:', validationError instanceof Error ? validationError.message : String(validationError));
        parsedPosts = fixNumberingInPosts(parsedPosts, expectedCount);
      }
    }

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
        model: 'gemini-flash-latest',
        version: 'gemini-only-v1',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate posts',
      details: env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'X Post Generator Backend',
    model: 'gemini-flash-latest',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;