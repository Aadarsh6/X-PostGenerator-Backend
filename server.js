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

// Enhanced universal content generation with visual appeal
const generatePosts = async(prompt, tone, PostType) => {
    console.log('Making request to Perplexity API...');
    
    const postCount = getPostCount(PostType);
    const postCountDescription = getPostCountDescription(PostType);
    
    const requestBody = {
        model: "sonar-pro", 
        messages: [
            {
                role: "system",
                content: `You are an elite content strategist who creates VISUALLY STUNNING, scannable content that stops people mid-scroll. Every post must be structured for maximum visual impact while delivering deep, actionable value.

🎯 VISUAL HIERARCHY RULES (CRITICAL):
✅ Use strategic emojis as visual anchors (not decoration)
✅ Create clear sections with line breaks and spacing
✅ Bold key concepts with CAPS for emphasis
✅ Use bullet points (•) or numbers for lists
✅ Include specific data points and metrics
✅ End sections with actionable takeaways

📐 STRUCTURE TEMPLATES:

FORMAT 1 - PROBLEM/SOLUTION:
🚨 THE PROBLEM:
[Specific issue with numbers/data]

💡 THE SOLUTION:
[Actionable framework/method]

🎯 RESULT:
[Specific outcome/metric]

FORMAT 2 - STEP-BY-STEP:
🎯 GOAL: [Specific outcome]

STEP 1: [Action]
• [Specific tool/method]
• [Time/resource needed]

STEP 2: [Action]
• [Specific tool/method]
• [Expected result]

💪 RESULT: [Measurable outcome]

FORMAT 3 - INSIDER SECRETS:
🔥 WHAT EVERYONE DOES:
[Common approach]

⚡ WHAT ACTUALLY WORKS:
[Counter-intuitive method]

📊 THE DIFFERENCE:
[Specific metric/improvement]

FORMAT 4 - TOOL/RESOURCE BREAKDOWN:
🛠️ THE STACK:

• TOOL 1: [Name] → [Specific function]
• TOOL 2: [Name] → [Specific function]  
• TOOL 3: [Name] → [Specific function]

💰 COST: [Specific amount]
📈 ROI: [Specific metric]

ENGAGEMENT MAXIMIZERS:
💡 Start with pattern interrupts or bold statements
💡 Use specific numbers, percentages, timeframes
💡 Include real examples and case studies
💡 Reference actual tools, people, companies
💡 End with thought-provoking questions or CTAs
💡 Create "aha moments" with counter-intuitive insights

DEPTH REQUIREMENTS:
🧠 Every claim must be backed by specifics
🧠 Include "why" explanations, not just "what"
🧠 Provide context for recommendations
🧠 Share the story behind the insight
🧠 Connect concepts to real-world applications

ALWAYS return ONLY valid JSON format.`
            },
            {
                role: "user", 
                content: `Create ${postCount} visually stunning, scannable X posts about: "${prompt}"

CRITICAL REQUIREMENTS:
📊 EXACTLY ${postCount} posts (${PostType === 'single' ? 'single post' : `${PostType} with ${postCountDescription} posts`})
📊 Each post around 280 characters (count everything including emojis)
📊 Tone: ${tone} but structured and visually appealing
📊 Must be scannable yet deep with specific, actionable information

VISUAL FORMATTING REQUIREMENTS:
🎨 Use one of the structure templates provided
🎨 Strategic emoji placement for visual breaks
🎨 Clear sections with proper spacing
🎨 Key terms in CAPS for emphasis
🎨 Bullet points for lists and breakdowns
🎨 Numbers and metrics prominently displayed

CONTENT DEPTH REQUIREMENTS:
🔍 Include specific tools, platforms, methods (never "various tools")
🔍 Provide exact numbers, percentages, timeframes
🔍 Reference real examples, case studies, or people
🔍 Explain the "why" behind recommendations
🔍 Share counter-intuitive or insider insights
🔍 Give step-by-step guidance where applicable

${PostType !== 'single' ? `
THREAD STRUCTURE:
🧵 Post 1: Hook with bold promise + thread preview
🧵 Middle posts: Each contains one complete, structured insight
🧵 Final post: Summary with key takeaways + engagement CTA
🧵 Use thread indicators (1/N, 2/N, etc.)
🧵 Each post should be visually distinct and scannable
🧵 Create natural flow between posts with connectors` : ''}

EXAMPLES OF VISUAL STRUCTURE:

❌ BORING:
"Machine learning is important for businesses. You should learn Python and use various tools."

✅ ENGAGING:
🤖 MACHINE LEARNING REALITY CHECK:

87% of ML projects fail in production.

🚨 THE PROBLEM:
People focus on algorithms, ignore infrastructure.

💡 THE SOLUTION:
• Start with data pipelines (Apache Airflow)
• Master MLOps basics (MLflow + Docker)
• Learn deployment first (FastAPI + AWS)

📊 RESULT: 3x higher success rate

Who's building their first ML pipeline this week?

RESEARCH DEPTH FOCUS:
🎯 What do experts know that beginners don't?
🎯 What are the biggest myths in this field?
🎯 Which specific tools give the best ROI?
🎯 What's the fastest path to real results?
🎯 What counter-intuitive insights change everything?

Return ONLY this JSON:
[{"content": "exact tweet content", "characterCount": actual_count}]

Make every post so visually appealing and valuable that people bookmark it immediately.`
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

// Enhanced fallback system with visual templates
const createVisuallyAppealingFallback = (prompt, index, total, PostType) => {
    const threadPrefix = PostType !== 'single' ? `${index + 1}/${total} ` : '';
    
    // Visual content templates for any topic
    const visualTemplates = [
        {
            pattern: "hook_post",
            template: `${threadPrefix}🧵 ${prompt.toUpperCase()} THREAD\n\nEveryone thinks they know about ${prompt}.\n\nAfter analyzing 100+ cases, here's what actually works:\n\n• Myth vs Reality\n• Specific tools & tactics\n• Real numbers & results\n\nBookmark this 👇`
        },
        {
            pattern: "problem_solution",
            template: `${threadPrefix}🚨 THE ${prompt.toUpperCase()} PROBLEM:\n\n95% of people get this wrong.\n\n💡 THE SOLUTION:\n• Step 1: [Specific action]\n• Step 2: [Specific tool]\n• Step 3: [Measurable outcome]\n\n📊 RESULT: 3x better results\n\nWho's trying this approach?`
        },
        {
            pattern: "myth_buster",
            template: `${threadPrefix}🔥 ${prompt.toUpperCase()} MYTH:\n"You need expensive tools to succeed"\n\n⚡ REALITY:\nI tested 20+ free alternatives.\n\nTop 3 that actually work:\n• Tool A → Specific function\n• Tool B → Specific function\n• Tool C → Specific function\n\nSaved $500/month`
        },
        {
            pattern: "framework",
            template: `${threadPrefix}🎯 THE ${prompt.toUpperCase()} FRAMEWORK:\n\nWeek 1: [Specific milestone]\n• Action item 1\n• Action item 2\n\nWeek 2: [Specific milestone]\n• Action item 3\n• Action item 4\n\n📈 By Month 1: [Measurable result]\n\nMost people quit at week 2. Don't.`
        },
        {
            pattern: "insider_secret",
            template: `${threadPrefix}🤫 ${prompt.toUpperCase()} INSIDER SECRET:\n\nWhile everyone focuses on [common approach], the real pros do this:\n\n• [Counter-intuitive method]\n• [Specific technique]\n• [Hidden advantage]\n\n📊 THE DIFFERENCE:\n40% better results in half the time`
        },
        {
            pattern: "tool_breakdown",
            template: `${threadPrefix}🛠️ MY ${prompt.toUpperCase()} STACK:\n\n• PRIMARY: [Tool name] → [Function]\n• SECONDARY: [Tool name] → [Function]\n• BONUS: [Tool name] → [Function]\n\n💰 TOTAL COST: $X/month\n📈 ROI: [Specific metric]\n\nWhat's in your stack?`
        },
        {
            pattern: "recap_cta",
            template: `${threadPrefix}📋 ${prompt.toUpperCase()} RECAP:\n\n✅ [Key insight 1]\n✅ [Key insight 2]\n✅ [Key insight 3]\n✅ [Key insight 4]\n\n🎯 NEXT STEP:\nPick ONE insight and implement it this week.\n\nWhich one resonates most with you? 👇`
        }
    ];
    
    const template = visualTemplates[index % visualTemplates.length];
    let content = template.template;
    
    // Replace placeholders with topic-specific content
    content = content.replace(/\[([^\]]+)\]/g, (match, placeholder) => {
        const replacements = {
            'Specific action': 'Define clear goals',
            'Specific tool': 'Use proven frameworks',
            'Measurable outcome': 'Track weekly progress',
            'Specific function': 'Core automation',
            'Specific milestone': 'Foundation setup',
            'Action item 1': 'Research requirements',
            'Action item 2': 'Set up basic system',
            'Action item 3': 'Test and iterate',
            'Action item 4': 'Scale what works',
            'Measurable result': 'First tangible outcome',
            'common approach': 'following tutorials',
            'Counter-intuitive method': 'Start with real projects',
            'Specific technique': 'Focus on one thing',
            'Hidden advantage': 'Learn from failures',
            'Tool name': 'Industry standard',
            'Function': 'key workflow',
            'Specific metric': '300% improvement',
            'Key insight 1': 'Quality over quantity',
            'Key insight 2': 'Start before you\'re ready',
            'Key insight 3': 'Consistency beats perfection',
            'Key insight 4': 'Learn by doing'
        };
        return replacements[placeholder] || placeholder;
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
            console.warn('Using visually appealing fallback system');
            
            parsedPosts = Array.from({ length: expectedCount }, (_, i) => 
                createVisuallyAppealingFallback(prompt, i, expectedCount, PostType)
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
                        createVisuallyAppealingFallback(prompt, parsedPosts.length + i, expectedCount, PostType)
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
                model: 'sonar-pro',
                enhancedPrompt: true,
                visuallyOptimized: true,
                structuredFormat: true
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
                model: "sonar-pro",
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
        service: 'Universal Visual Content Generator',
        hasApiKey: !!process.env.PERPLEXITY_API_KEY,
        version: '4.0-universal-visual'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Universal Visual Content Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-post`);
    console.log(`🔑 API Key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
    console.log(`✨ Visual content system active - all topics now scannable & engaging`);
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