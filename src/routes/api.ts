import { Router, type Request, type Response } from 'express';
import { env } from '../config/env.js';
import { createOptimizedPrompt } from '../services/promptBuilder.js';
import { getPostCount } from '../utils/postCounter.js';
import { createAuthenticFallback } from '../utils/fallback.js';
import { intelligentTrim } from '../utils/trimmer.js';
import { fixNumberingInPosts } from '../utils/validator.js';
import type { AuthRequest, Post } from '../types/index.js';
import { generateWithGemini } from '../services/groq.js';
import { validateInput } from '../middlewar/validateInput.js';
import { authMiddleware } from '../Auth/middleware.js';
import prisma from '../../prisma/prisma.js';

const router = Router();

router.post('/generate-post', authMiddleware, validateInput, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, tone, PostType } = req.body;
    const userId = req.userId!;
    const threadId = PostType !== 'single' ? crypto.randomUUID():null


    console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

    let parsedPosts: Post[] = [];
    const expectedCount = getPostCount(PostType);

    try {
      const optimizedPrompt = createOptimizedPrompt(prompt, tone, expectedCount, PostType);

      const aiResult = await generateWithGemini(prompt, tone, PostType, optimizedPrompt, expectedCount);
      const { content: aiResponse } = aiResult;

      const parsed: any = JSON.parse(aiResponse);
console.log('🔍 PARSED:', JSON.stringify(parsed, null, 2));

      // Always normalize into an array, regardless of shape
        // parsedPosts = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.posts) ? parsed.posts : [parsed]);

      const unwrapped = Array.isArray(parsed) ? parsed : (parsed.posts || parsed.data || parsed.items || Object.values(parsed)[0]);
      parsedPosts = Array.isArray(unwrapped) ? unwrapped : [parsed];


      console.log('✅ AI generation successful');

    } catch (aiError) {
      console.warn('AI failed, using fallback:', aiError instanceof Error ? aiError.message : String(aiError));
      parsedPosts = Array.from({ length: expectedCount }, (_, i) =>
        createAuthenticFallback(prompt, i, expectedCount, PostType)
      );
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
          parsedPosts = fixNumberingInPosts(parsedPosts, expectedCount);
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
        model: 'llama-3.3-70b-versatile',
        version: 'llama-3',
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

router.get("/posts", authMiddleware, async(req:AuthRequest, res: Response)=>{
  try {
    const userId = req.userId as string
    const posts = await prisma.post.findMany({
      where: { userId },  
      orderBy: {createdAt: 'desc'}
    })

    const grouped = new Map<string, typeof posts>();
    for (const post of posts){
    const key = post.threadId ?? post.id;
    if(!grouped.has(key))grouped.set(key, [])
      grouped.get(key)!.push(post)
    }
    const threads = Array.from(grouped.values()).map((group) =>
      group.sort((a, b) => a.postNumber - b.postNumber)
    );

    res.json({ success: true, count: threads.length, threads });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

router.delete('/posts/thread/:threadId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const threadId = req.params.threadId as string
    
    const result = await prisma.post.deleteMany({
      where: { threadId, userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }
    
    res.json({ success: true, deleted: result.count });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete thread' });
  }
});

router.delete("/posts/:id", authMiddleware, async(req:AuthRequest,  res:Response)=>{
  try {
    const userId = req.userId as string
    const { id } = req.params as { id: string };

    const result = await prisma.post.deleteMany({
      where: {id, userId},
    })
    if(result.count === 0){
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted' });
  }catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

router.post('/posts/save', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { posts, PostType, tone } = req.body;

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ success: false, error: 'Posts array is required' });
    }

    const threadId = PostType !== 'single' ? crypto.randomUUID() : null;

    const saved = await Promise.all(
      posts.map(async (post: Post, index: number) => {
        return prisma.post.create({
          data: {
            userId,
            content: post.content,
            threadId,
            postType: PostType,
            tone,
            characterCount: post.characterCount,
            postNumber: PostType === 'single' ? 1 : index,
          },
        });
      })
    );

    res.json({ success: true, saved: saved.length, threadId });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save posts' });
  }
});



router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'X Post Generator Backend',
    model: 'llama-3.3-70b-versatile',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;