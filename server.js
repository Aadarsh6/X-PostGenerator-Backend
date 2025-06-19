import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express()
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
app.use(express.json())

// Helper functions
const getPostCount = (PostType) => {
    switch(PostType) {
        case 'single':
            return 1;
        case 'thread':
            return Math.floor(Math.random() * 4) + 2;
        case 'long-thread':
            return Math.floor(Math.random() * 5) + 6;
        default:
            return 1;
    }
};

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

// Enhanced universal content generation
const generatePosts = async(prompt, tone, PostType) => {
    console.log('Making request to Perplexity API...');
    
    const postCount = getPostCount(PostType);
    const postCountDescription = getPostCountDescription(PostType);
    
    const requestBody = {
        model: "sonar-pro",
        messages: [
            {
                role: "system",
                content: `You are an elite content strategist with expertise across ALL domains. You create viral, high-value posts by:

🎯 RESEARCH FIRST: Use your knowledge base to find specific, lesser-known insights about the topic
🎯 VALUE DENSITY: Every word must provide concrete, actionable value
🎯 AUTHENTICITY: Write like someone who's actually done this, not someone who just read about it
🎯 SPECIFICITY: Use exact numbers, tools, timeframes, and real examples

CONTENT QUALITY STANDARDS:
✅ Provide specific tools, resources, or steps (never say "various tools" - name them)
✅ Include real numbers, percentages, or timeframes when possible
✅ Reference actual people, companies, or case studies
✅ Give actionable advice someone can implement today
✅ Share insider knowledge or counter-intuitive insights
✅ Use personal language ("I learned," "After testing 50+ tools")

ALWAYS return ONLY valid JSON format.`
            },
            {
                role: "user", 
                content: `Create ${postCount} high-engagement X posts about: "${prompt}"

CRITICAL REQUIREMENTS:
📊 EXACTLY ${postCount} posts (${PostType === 'single' ? 'single post' : `${PostType} with ${postCountDescription} posts`})
📊 Each post ~280 characters (count everything)
📊 Tone: ${tone} but authentic and conversational
📊 Must include SPECIFIC, actionable information

RESEARCH & DEPTH REQUIREMENTS:
🔍 Find the most valuable, specific information about "${prompt}"
🔍 Include exact tools, platforms, resources, or methods
🔍 Provide real numbers, timeframes, or success metrics
🔍 Share counterintuitive or lesser-known insights
🔍 Give step-by-step guidance where applicable

CONTENT STRUCTURE:
Hook (curiosity/bold statement) → Specific Value (tools/numbers/steps) → Engagement (question/CTA)

ENGAGEMENT MAXIMIZERS:
💡 Start with pattern interrupts: "Everyone says X, but here's what actually works:"
💡 Use specific examples: "I analyzed 500 successful cases and found..."
💡 Include surprising statistics or facts
💡 End with actionable next steps or thought-provoking questions
💡 Use strategic emojis for emphasis (not decoration)

${PostType !== 'single' ? `
THREAD STRUCTURE:
🧵 Post 1: Hook + promise of specific value coming
🧵 Middle posts: Each contains one complete, actionable insight
🧵 Final post: Summary + clear call-to-action
🧵 Use thread indicators (1/N, 2/N or 🧵)
🧵 Create mini-cliffhangers between posts` : ''}

EXAMPLES OF HIGH-VALUE SPECIFICITY:
❌ Bad: "Use social media tools to grow"
✅ Good: "Buffer for scheduling, Canva for graphics, Hootsuite Analytics for tracking - this combo grew my following from 500 to 15K in 6 months"

❌ Bad: "Learning is important"  
✅ Good: "I spent $2,847 on courses that taught me nothing. Then I found these 3 free resources that changed everything: [specific names]"

❌ Bad: "Start small and practice"
✅ Good: "Day 1: Set up your environment (30 min). Day 2: Build project #1 using [specific tool]. Day 7: You'll have a working prototype"

INSIDER KNOWLEDGE FOCUS:
🎯 What do experts know that beginners don't?
🎯 What are the biggest mistakes people make?
🎯 What shortcuts or hacks actually work?
🎯 Which tools/methods give the best ROI?
🎯 What's the fastest path to results?

Return ONLY this JSON:
[{"content": "exact tweet content", "characterCount": actual_count}]

Make every post so valuable that people bookmark it immediately.`
            }
        ],
        temperature: 0.7,
        max_tokens: PostType === 'long-thread' ? 1500 : 800
    };
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST", 
        headers:{
            "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Perplexity API Error Response:', errorData);
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0].message.content.trim(),
        expectedCount: postCount
    };
};

// Enhanced fallback system for high-quality content
const createHighValueFallback = (prompt, index, total, PostType) => {
    const threadPrefix = PostType !== 'single' ? `${index + 1}/${total} ` : '';
    
    // High-value content templates based on proven patterns
    const valueTemplates = [
        {
            pattern: "mistake_revelation",
            template: `${threadPrefix}Biggest mistake with ${prompt}?\n\nEveryone focuses on [common approach]. But after analyzing 100+ cases, the real secret is [specific insight].\n\nChanged everything for me. 🧵`
        },
        {
            pattern: "counter_intuitive", 
            template: `${threadPrefix}Everyone says you need [common belief] for ${prompt}.\n\nActually tested this with 50+ examples. The opposite is true.\n\nHere's what actually works: 👇`
        },
        {
            pattern: "specific_framework",
            template: `${threadPrefix}The 3-step framework that transformed my ${prompt} results:\n\n1. [Specific action]\n2. [Specific tool/method]\n3. [Specific outcome]\n\nTook me 2 years to figure this out. ⚡`
        },
        {
            pattern: "tool_stack",
            template: `${threadPrefix}My exact ${prompt} tech stack:\n\n• Tool 1 for [specific function]\n• Tool 2 for [specific function] \n• Tool 3 for [specific function]\n\nTotal cost: $X/month. ROI: [specific metric] 📈`
        },
        {
            pattern: "timeline_breakdown",
            template: `${threadPrefix}Timeline for mastering ${prompt}:\n\nWeek 1-2: [Specific milestone]\nWeek 3-4: [Specific milestone]\nMonth 2: [Specific milestone]\n\nMost people quit at week 3. Don't. 💪`
        }
    ];
    
    const template = valueTemplates[index % valueTemplates.length];
    const content = template.template.replace(/\[([^\]]+)\]/g, (match, placeholder) => {
        // Generate specific content based on placeholder
        switch(placeholder) {
            case 'common approach':
                return 'the basic tutorials';
            case 'specific insight': 
                return 'focusing on real-world application first';
            case 'common belief':
                return 'expensive tools';
            case 'Specific action':
                return 'Start with one focused project';
            case 'Specific tool/method':
                return 'Use free alternatives first';
            case 'Specific outcome':
                return 'Measure weekly progress';
            case 'specific function':
                return 'core functionality';
            case 'specific metric':
                return '300% improvement';
            case 'Specific milestone':
                return 'Complete first project';
            default:
                return placeholder;
        }
    });
    
    return {
        content: content,
        characterCount: content.length
    };
};

// Main API endpoint
app.post('/api/generate-post', async (req, res) => {
    try {
        const { prompt, tone, PostType } = req.body;

        if (!prompt || !tone || !PostType) {
            return res.status(400).json({ error: 'Missing required fields: prompt, tone, PostType' });
        }

        if (!process.env.PERPLEXITY_API_KEY) {
            return res.status(500).json({ error: 'PERPLEXITY_API_KEY not configured' });
        }

        console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

        const aiResult = await generatePosts(prompt, tone, PostType);
        const { content: aiResponse, expectedCount } = aiResult;
        
        let parsedPosts;
        try {
            const cleanedResponse = aiResponse
                .replace(/```json\n?|\n?```/g, '')
                .replace(/```\n?|\n?```/g, '')
                .replace(/^[^[{]*/, '')
                .replace(/[^}\]]*$/, '')
                .trim();
            
            parsedPosts = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.warn('Using high-value fallback system');
            
            // Use high-quality fallback instead of generic content
            parsedPosts = Array.from({ length: expectedCount }, (_, i) => 
                createHighValueFallback(prompt, i, expectedCount, PostType)
            );
        }

        if (!Array.isArray(parsedPosts)) {
            parsedPosts = [parsedPosts];
        }

        // Ensure correct post count
        if (parsedPosts.length !== expectedCount) {
            if (parsedPosts.length < expectedCount) {
                const additionalPosts = expectedCount - parsedPosts.length;
                for (let i = 0; i < additionalPosts; i++) {
                    parsedPosts.push(
                        createHighValueFallback(prompt, parsedPosts.length + i, expectedCount, PostType)
                    );
                }
            } else if (parsedPosts.length > expectedCount) {
                parsedPosts = parsedPosts.slice(0, expectedCount);
            }
        }

        // Validate and optimize character counts
        parsedPosts = parsedPosts.map((post, index) => {
            const actualCount = post.content ? post.content.length : 0;
            const isOverLimit = actualCount > 280;
            
            if (isOverLimit) {
                let truncated = post.content.substring(0, 270);
                const lastSpace = truncated.lastIndexOf(' ');
                if (lastSpace > 200) {
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
                enhancedPrompt: true,
                highValueSystem: true
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

// Test endpoint
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
                messages: [{ role: "user", content: "Say hello" }],
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Universal High-Value Post Generator',
        hasApiKey: !!process.env.PERPLEXITY_API_KEY,
        version: '3.0-universal-high-value'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Universal High-Value Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-post`);
    console.log(`🔑 API Key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
    console.log(`✨ Universal high-value content system active`);
});

// Frontend service remains the same
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

export const testApiKey = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/test-key`);
        return await response.json();
    } catch (error) {
        console.error('API key test failed:', error);
        return { success: false, error: error.message };
    }
};

export const checkBackendHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return await response.json();
    } catch (error) {
        console.error('Backend health check failed:', error);
        return { status: 'ERROR', error: error.message };
    }
};