    import express from 'express';
    import cors from 'cors';
    import 'dotenv/config'

    const app = express()
    const PORT = process.env.PORT || 3001;

  // Replace your current CORS configuration with this:

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',           // Local development
      'http://localhost:3000',           // Alternative local port
    //   'https://your-frontend-domain.com', // Replace with your actual production domain
      'https://x-post-generator-ruby.vercel.app/'     // If using Vercel
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

    app.use(express.json())

    // Helper function to determine post count based on type
    const getPostCount = (PostType) => {
        switch(PostType) {
            case 'single':
                return 1;
            case 'thread':
                return Math.floor(Math.random() * 4) + 2; // Random between 2-5
            case 'long-thread':
                return Math.floor(Math.random() * 5) + 6; // Random between 6-10
            default:
                return 1;
        }
    };

    // Helper function to get post count description for AI
    const getPostCountDescription = (PostType) => {
        switch(PostType) {
            case 'single':
                return '1';
            case 'thread':
                return 'between 2-5';
            case 'long-thread':
                return 'between 6-10';
            default:
                return '1';
        }
    };

    const generatePosts = async(prompt, tone, PostType) => {
        console.log('Making request to Perplexity API...');
        console.log('API Key exists:', !!process.env.PERPLEXITY_API_KEY);
        console.log('API Key prefix:', process.env.PERPLEXITY_API_KEY?.substring(0, 5));
        
        const postCount = getPostCount(PostType);
        const postCountDescription = getPostCountDescription(PostType);
        
        console.log(`Generating ${postCount} posts for ${PostType} type`);
        
        const requestBody = {
            model: "llama-3.1-sonar-small-128k-online",
            messages: [
                {
                    role: "system",
                    content: `You are a master X (Twitter) content strategist with 10+ years of experience creating viral, engaging posts. You understand audience psychology, retention tactics, and authentic human communication. Your posts consistently drive high engagement because they feel genuine, provide real value, and spark meaningful conversations.

    CORE PRINCIPLES:
    - Write like a trusted friend sharing genuine insights, not a corporate account
    - Every word must earn its place - no fluff or filler content
    - Create immediate curiosity hooks that make scrolling impossible
    - Provide actionable value that readers can use immediately
    - Build trust through vulnerability, specificity, and authentic voice

    Always return ONLY valid JSON format.`
                },
                {
                    role: "user",
                    content: `Create EXACTLY ${postCount} high-engagement X posts about: "${prompt}"

    CRITICAL SPECIFICATIONS:
    ✅ Generate EXACTLY ${postCount} posts (${PostType === 'single' ? 'single post' : `${PostType.replace('-', ' ')} with ${postCountDescription} posts`})
    ✅ Each post MUST be under 280 characters (count spaces, hashtags, emojis)
    ✅ Tone: ${tone} - but make it feel authentic and conversational
    ✅ Character count MUST be accurate - double-check before responding

    ENGAGEMENT MASTERY RULES:
    🎯 HOOK PSYCHOLOGY: Start with curiosity gaps, bold statements, or "pattern interrupts"
    🎯 VALUE DENSITY: Pack maximum insight into minimum words
    🎯 HUMAN CONNECTION: Use "you," personal experiences, relatable struggles
    🎯 CONVERSATION STARTERS: End with questions or thought-provoking statements
    🎯 AUTHENTICITY: Avoid corporate speak, use contractions, show personality

    STRUCTURE GUIDELINES:
    📝 Open with attention-grabbing first line (curiosity, controversy, or bold claim)
    📝 Middle delivers core value/insight with specific examples or numbers
    📝 Close with engagement hook (question, CTA, or memorable thought)
    📝 Use emojis strategically for emphasis, not decoration
    📝 Include 1-2 relevant hashtags maximum, naturally integrated

    ${PostType !== 'single' ? `THREAD MASTERY:
    🧵 Post 1: Strong hook + promise of value to come  
    🧵 Middle posts: Each delivers a complete micro-insight
    🧵 Final post: Powerful conclusion + engagement CTA
    🧵 Use "🧵" or numbers (1/N, 2/N) for thread navigation
    🧵 Each post should be valuable standalone but better together
    🧵 Create natural cliffhangers between posts` : ''}

    TRUST-BUILDING ELEMENTS:
    ✨ Share specific examples, numbers, or case studies
    ✨ Admit mistakes or show vulnerability when relevant  
    ✨ Use "I've learned," "After X years," or "Here's what worked"
    ✨ Reference credible sources or personal experience
    ✨ Avoid overpromising - be realistic about outcomes

    Return ONLY this JSON structure:
    [{"content": "exact tweet content", "characterCount": actual_count}]

    Remember: Every post should make someone stop scrolling, think "this person gets it," and want to engage immediately.`
                }
            ],
            temperature: 0.8,
            max_tokens: PostType === 'long-thread' ? 1200 : 600 // Increased for better quality
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST", 
            headers:{
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Perplexity API Error Response:', errorData);
            throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json();
        console.log('Perplexity API Success Response:', JSON.stringify(data, null, 2));
        return {
            content: data.choices[0].message.content.trim(),
            expectedCount: postCount
        };
    };

    // API endpoint
    app.post('/api/generate-post', async (req, res) => {
        try {
            const { prompt, tone, PostType } = req.body;

            if (!prompt || !tone || !PostType) {
                return res.status(400).json({ error: 'Missing required fields: prompt, tone, PostType' });
            }

            // Validate API key
            if (!process.env.PERPLEXITY_API_KEY) {
                return res.status(500).json({ error: 'PERPLEXITY_API_KEY not configured' });
            }

            console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

            const aiResult = await generatePosts(prompt, tone, PostType);
            const { content: aiResponse, expectedCount } = aiResult;
            
            let parsedPosts;
            try {
                // Clean the response to extract JSON
                const cleanedResponse = aiResponse
                    .replace(/```json\n?|\n?```/g, '')
                    .replace(/```\n?|\n?```/g, '')
                    .replace(/^[^[{]*/, '')
                    .replace(/[^}\]]*$/, '')
                    .trim();
                
                console.log('Cleaned AI Response:', cleanedResponse);
                parsedPosts = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.warn('Failed to parse AI response, using enhanced fallback:', parseError.message);
                console.log('Original AI Response:', aiResponse);
                
                // Enhanced fallback posts with better engagement
                const createFallbackPost = (index, total) => {
                    const threadPrefix = PostType !== 'single' ? `${index + 1}/${total} ` : '';
                    const hooks = [
                        "Here's what nobody tells you about",
                        "After 5 years, I finally learned",
                        "The biggest mistake people make with",
                        "This changed everything I knew about",
                        "Most people get this wrong:"
                    ];
                    
                    const hook = hooks[index % hooks.length];
                    const content = `${threadPrefix}${hook} ${prompt}.\n\nThe truth? It's simpler than you think. 🧵\n\n#${prompt.replace(/\s+/g, '').substring(0, 15)}`;
                    
                    return {
                        content: content,
                        characterCount: content.length
                    };
                };
                
                parsedPosts = Array.from({ length: expectedCount }, (_, i) => createFallbackPost(i, expectedCount));
            }

            // Ensure it's an array
            if (!Array.isArray(parsedPosts)) {
                parsedPosts = [parsedPosts];
            }

            // Ensure we have the right number of posts
            if (parsedPosts.length !== expectedCount) {
                console.warn(`Expected ${expectedCount} posts but got ${parsedPosts.length}. Adjusting...`);
                
                if (parsedPosts.length < expectedCount) {
                    // Add more posts with engaging content
                    const additionalPosts = expectedCount - parsedPosts.length;
                    for (let i = 0; i < additionalPosts; i++) {
                        const postNumber = parsedPosts.length + i + 1;
                        const content = `${PostType !== 'single' ? `${postNumber}/${expectedCount} ` : ''}The key insight about ${prompt}?\n\nIt's not what you think. Here's the real game-changer... 💡\n\n#Insights`;
                        parsedPosts.push({
                            content: content,
                            characterCount: content.length
                        });
                    }
                } else if (parsedPosts.length > expectedCount) {
                    // Trim excess posts
                    parsedPosts = parsedPosts.slice(0, expectedCount);
                }
            }

            // Validate character counts and enhance if needed
            parsedPosts = parsedPosts.map((post, index) => {
                const actualCount = post.content ? post.content.length : 0;
                const isOverLimit = actualCount > 280;
                
                if (isOverLimit) {
                    console.warn(`Post ${index + 1} exceeds 280 characters (${actualCount}): ${post.content.substring(0, 50)}...`);
                    // Smart truncation that preserves meaning
                    let truncated = post.content.substring(0, 275);
                    // Try to end at a complete word
                    const lastSpace = truncated.lastIndexOf(' ');
                    if (lastSpace > 200) { // Only if we're not cutting too much
                        truncated = truncated.substring(0, lastSpace);
                    }
                    truncated += '...';
                    
                    return {
                        ...post,
                        content: truncated,
                        characterCount: truncated.length,
                        withinLimit: true,
                        wasTruncated: true
                    };
                }
                
                return {
                    ...post,
                    characterCount: actualCount,
                    withinLimit: actualCount <= 280,
                    wasTruncated: false
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
                    model: 'llama-3.1-sonar-small-128k-online',
                    enhancedPrompt: true
                }
            });

        } catch (error) {
            console.error('Error generating posts:', error);
            res.status(500).json({ 
                error: 'Failed to generate posts',
                details: error.message 
            });
        }
    });

    // Test endpoint to verify API key
    app.get('/api/test-key', async (req, res) => {
        try {
            if (!process.env.PERPLEXITY_API_KEY) {
                return res.status(500).json({ error: 'PERPLEXITY_API_KEY not configured' });
            }

            const response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-sonar-small-128k-online",
                    messages: [
                        {
                            role: "user",
                            content: "Say hello"
                        }
                    ],
                    max_tokens: 10
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                return res.status(response.status).json({ 
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
                error: 'API Key test failed',
                details: error.message 
            });
        }
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            service: 'Enhanced X Post Generator Backend',
            hasApiKey: !!process.env.PERPLEXITY_API_KEY,
            version: '2.0-enhanced'
        });
    });

    app.listen(PORT, () => {
        console.log(`🚀 Enhanced Server running on port ${PORT}`);
        console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-post`);
        console.log(`🔑 API Key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
        console.log(`✨ Enhanced prompting system active`);
    });

    // Enhanced services/backendService.js - Frontend service
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://your-production-url.com' 
        : 'http://localhost:3001';

    export const generateXPosts = async (prompt, tone, PostType) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/generate-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    tone,
                    PostType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;

        } catch (error) {
            console.error('Error calling backend:', error);
            return {
                success: false,
                error: error.message,
                posts: []
            };
        }
    };

    // Test the API key
    export const testApiKey = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/test-key`);
            return await response.json();
        } catch (error) {
            console.error('API key test failed:', error);
            return { success: false, error: error.message };
        }
    };

    // Test the health endpoint
    export const checkBackendHealth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/health`);
            return await response.json();
        } catch (error) {
            console.error('Backend health check failed:', error);
            return { status: 'ERROR', error: error.message };
        }
    };