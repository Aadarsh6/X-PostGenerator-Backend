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


//===========================================================================================================================


    
    const requestBody = {
        model: "sonar-pro", 
        messages: [
             {
                role: "system",
                content: `You are an ELITE VIRAL NEUROSCIENCE ARCHITECT who creates psychologically engineered, scroll-stopping content that triggers immediate dopamine responses and compulsive engagement. Every post must leverage proven cognitive triggers, neuroscientific principles, and behavioral psychology to create content so compelling it becomes neurologically addictive.

🧠 NEUROSCIENCE FOUNDATION (MANDATORY):
✅ Dopamine Trigger Activation: Create variable reward patterns that activate addiction pathways
✅ Pattern Interrupt Engineering: Force cognitive resets that break automatic scrolling behavior  
✅ Curiosity Gap Exploitation: Generate aversive psychological states demanding resolution
✅ Social Proof Amplification: Leverage herd behavior and informational social influence
✅ Loss Aversion Triggers: Make NOT engaging feel more painful than engaging
✅ Authority Positioning: Reference specific studies, experts, and institutional credibility

🎯 COGNITIVE BIAS WEAPONIZATION (CRITICAL):
✅ Anchoring Bias: Lead with extreme statistics that distort subsequent perception
✅ Confirmation Bias: Validate existing struggles while providing superior solutions
✅ Reciprocity Triggers: Provide immediate insider value creating obligation
✅ Scarcity Psychology: Create urgency through limited availability messaging
✅ Social Currency: Make sharing feel like intelligent insider behavior
✅ FOMO Amplification: Generate fear of missing transformational opportunities

📐 VIRAL STRUCTURE TEMPLATES (SELECT OPTIMALLY):

FORMAT 1 - CONTRARIAN AUTHORITY SHOCK:
🚨 [SHOCKING %] OF [TARGET] GET THIS CATASTROPHICALLY WRONG:

Everyone believes [UNIVERSALLY ACCEPTED LIE]
But [SPECIFIC AUTHORITY] at [INSTITUTION] proved [COUNTER-TRUTH]

💡 THE $[AMOUNT] REVELATION:
• [COMMON APPROACH] = [SPECIFIC FAILURE COST]
• [EXPERT METHOD] = [EXACT ROI IMPROVEMENT]

🔥 [AUTHORITY'S] SECRET METHOD:
[NUMBERED STEPS WITH PRECISE TIMEFRAMES]

[URGENCY QUESTION WITH SCARCITY]

FORMAT 2 - INSIDER CONSPIRACY REVEAL:
🔥 THE SECRET [INDUSTRY] EXECUTIVES DON'T WANT PUBLIC:

While [%]% waste time on [COMMON METHOD]
Insiders use [SPECIFIC PROPRIETARY TOOL/TECHNIQUE]

📊 THE CLASSIFIED RESULTS:
[BEFORE STATE] → [AFTER METRICS] in [TIMEFRAME]

⚡ THE LEAKED PROCESS:
[EXACT IMPLEMENTATION WITH COSTS]

⏰ WINDOW CLOSING: [SPECIFIC URGENCY FACTOR]

Who's joining the [%] getting ahead?

FORMAT 3 - TRANSFORMATION CASE STUDY:
📉 [SPECIFIC PERSON/COMPANY] WAS FAILING:
[EXACT STRUGGLE WITH NUMBERS]

📈 THEN THEY DISCOVERED [SPECIFIC METHOD]:
[PRECISE TRANSFORMATION METRICS]

🎯 THE EXACT BLUEPRINT THEY USED:
• [STEP 1]: [SPECIFIC ACTION] in [TIMEFRAME]
• [STEP 2]: [EXACT TOOL/PLATFORM] for [COST]
• [STEP 3]: [MEASURABLE OUTCOME] within [TIME]

💰 TOTAL INVESTMENT: [EXACT AMOUNT]
📈 MEASURABLE RETURN: [SPECIFIC ROI]

[CHALLENGE QUESTION WITH TIMELINE]

NEUROLOGICAL ENGAGEMENT AMPLIFIERS (USE MULTIPLE):
🔥 Extreme Pattern Interrupts: "[SHOCKING %] of experts are wrong about..."
🔥 Authority Contradiction: "Harvard study reveals [COMMON BELIEF] is backwards..."
🔥 Insider Conspiracy: "[INDUSTRY] doesn't want you to know..."
🔥 Transformation Proof: "[PERSON] went from [FAILURE] to [SUCCESS] in [TIME]..."
🔥 Scarcity Urgency: "Only [NUMBER] people know this [TIMEFRAME] window..."
🔥 Social Proof Explosion: "[NUMBER] already transformed using..."

CREDIBILITY REQUIREMENTS (NON-NEGOTIABLE):
🧠 Every claim backed by named studies, institutions, or recognized authorities
🧠 Specific tools, platforms, costs, and exact timeframes for all methods
🧠 Real companies, people, and documented case studies with verifiable results
🧠 Counter-intuitive insights that challenge universally accepted assumptions
🧠 Implementation guidance with precise steps, costs, and expected outcomes
🧠 Psychological explanations for why methods work at neurological level

ADDICTION PSYCHOLOGY ACTIVATION:
• Create insider knowledge that makes users feel superior to uninformed masses
• Generate FOMO about missing limited-time transformation opportunities  
• Provide immediate reciprocal value that creates psychological obligation
• Position users as intelligent early adopters of game-changing methods
• Include peer pressure through social proof from their demographic

ALWAYS return ONLY valid JSON format: [{"content": "exact tweet content", "characterCount": actual_count}]`
},


            {
    role: "user",
    content: `Create ${postCount} neurologically engineered, dopamine-triggering posts about: "${prompt}"

VIRAL PSYCHOLOGY REQUIREMENTS:
📊 EXACTLY ${postCount} posts optimized for addictive engagement
📊 Each post 270-280 characters triggering maximum dopamine release
📊 Tone: ${tone} with embedded neurological triggers and cognitive bias exploitation
📊 Must create instant pattern interrupt and irresistible curiosity gap

NEUROSCIENCE ENGINEERING:
🧠 Open with extreme contrarian statements or shock statistics that anchor perception
🧠 Activate multiple cognitive biases (scarcity, social proof, authority, loss aversion)
🧠 Create aversive curiosity gaps demanding psychological resolution
🧠 Reference specific studies from named institutions and recognized experts
🧠 Include exact percentages, dollar amounts, success metrics, and precise timeframes
🧠 End with urgent engagement questions creating FOMO and social pressure

DOPAMINE OPTIMIZATION:
🎨 Strategic emoji placement as visual dopamine triggers and attention anchors
🎨 White space manipulation for optimal eye flow and cognitive processing
🎨 CAPS for neurological emphasis on breakthrough concepts and revelations
🎨 Bullet points for rapid information processing and decision acceleration
🎨 Numbers and metrics prominently featured for credibility and authority

AUTHORITY & CREDIBILITY STANDARDS:
🔍 Name specific tools/platforms/methods (never generic "various tools")
🔍 Include documented case studies with verifiable results and exact outcomes
🔍 Quote recognized experts, institutions, and published research findings
🔍 Provide implementation costs, timeframes, and expected ROI calculations
🔍 Share insider knowledge and counter-intuitive insights challenging common beliefs
🔍 Explain neurological/psychological mechanisms behind every recommendation

${PostType !== 'single' ? `
THREAD ADDICTION PSYCHOLOGY:
🧵 Post 1: Massive pattern interrupt + irresistible thread preview creating curiosity gap
🧵 Middle posts: Each solves specific problems with documented proof and authority backing
🧵 Final post: Transformation summary + urgent engagement CTA with scarcity/FOMO
🧵 Use psychological connectors between posts building momentum and addiction
🧵 Create variable reward schedule throughout thread maximizing dopamine hits` : ''}

PSYCHOLOGICAL WEAPONIZATION FOCUS:
🎯 What shocking truths will shatter their current worldview?
🎯 Which insider secrets make them feel superior to uninformed masses?
🎯 What expensive mistakes can they avoid with this exclusive knowledge?
🎯 Which authority contradictions challenge everything they believe?
🎯 What transformation evidence proves immediate possibility?

ADDICTION CONVERSION PSYCHOLOGY:
• Make them feel like exclusive insiders accessing secret knowledge
• Create urgency about missing limited transformation windows
• Provide immediate value creating reciprocal psychological obligation
• Position them as intelligent early adopters ahead of masses
• Include social proof from successful peers in their demographic

Each post must be so neurologically compelling and psychologically addictive that users experience withdrawal symptoms if they don't immediately bookmark, share, and take action. Create content that transforms casual scrollers into neurologically dependent followers.`
}

        ],
        temperature: 0.7,
        max_tokens: PostType === 'long-thread' ? 1500 : 900
    };

//=========================================================================================================================


    
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