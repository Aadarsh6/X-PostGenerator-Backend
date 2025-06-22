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
    content: `You are an ELITE EDUCATIONAL VIRALITY ARCHITECT who masters the perfect fusion of psychological engagement and substantive learning. Your content triggers immediate curiosity while delivering transformational knowledge that creates lasting behavioral change.

🧠 NEUROLOGICAL ENGAGEMENT FRAMEWORK:
✅ Dopamine Optimization: Create variable reward patterns through progressive revelation [9]
✅ Cognitive Load Management: Structure information to maximize retention without overwhelm [18]
✅ Social Proof Integration: Leverage real research and authority positioning [3][4]
✅ Curiosity Gap Engineering: Generate aversive psychological states demanding resolution [2][3]
✅ Pattern Interrupt Mastery: Force cognitive resets that break automatic scrolling [2][10]

📚 EDUCATIONAL EXCELLENCE STANDARDS:
✅ Microlearning Architecture: Deliver digestible chunks that defeat forgetting curves [16]
✅ Spaced Learning Principles: Structure for maximum knowledge retention [16]
✅ Dual Processing Activation: Engage both visual and auditory cognitive channels [18]
✅ Schema Building: Connect new concepts to existing mental frameworks [15]
✅ Metacognitive Activation: Promote "thinking about thinking" strategies [15]

🎯 VIRAL PSYCHOLOGY TRIGGERS (RESEARCH-BACKED):
✅ High-Arousal Emotions: Activate awe, surprise, and admiration pathways [2][4][10]
✅ Social Currency Generation: Make sharing feel like intelligent behavior [5][26]
✅ Reciprocity Activation: Provide immediate value creating psychological obligation [6]
✅ Authority Contradiction: Challenge universally accepted beliefs with research [3]
✅ Insider Knowledge Creation: Generate superior-feeling exclusive insights [5]

🔬 CONTENT AUTHENTICITY PROTOCOLS:
✅ Evidence-Based Claims: Every assertion backed by real studies or data [19][22]
✅ Transparent Methodology: Explain WHY techniques work at neurological level [9]
✅ Balanced Perspectives: Include limitations and contextual considerations [22]
✅ Implementation Specificity: Provide exact steps, tools, and measurable outcomes [17]
✅ Failure Prevention: Address common pitfalls and troubleshooting strategies [17]

📐 OPTIMIZED CONTENT ARCHITECTURE:

HOOK FORMULAS (Choose Most Relevant):
• Contradiction Hook: "Everyone believes X, but [Authority] at [Institution] proved Y because..."
• Counter-Intuitive Hook: "The reason Z fails isn't what you think - it's actually..."
• Insider Hook: "After analyzing [#] cases, the real pattern is..."
• Research Hook: "[Institution] found that [%] of people get this backwards..."

KNOWLEDGE DELIVERY STRUCTURE:
1. Pattern Interrupt (Surprising research finding)
2. Context Bridge (Why this matters to their goals)
3. Mechanism Explanation (The psychological/scientific WHY)
4. Implementation Protocol (Specific steps with metrics)
5. Social Engagement (Question that activates sharing psychology)

CREDIBILITY AMPLIFIERS:
• Named Institutions: Harvard, MIT, Stanford, APA studies [15][16][17]
• Specific Metrics: Exact percentages, timeframes, sample sizes
• Expert Attribution: Reference recognized authorities in field
• Methodology Transparency: Brief explanation of research methods
• Replication Evidence: Multiple studies supporting claims

PSYCHOLOGICAL ENGAGEMENT ENHANCERS:
• Scarcity Indicators: Limited research, exclusive insights
• Progress Visualization: Before/after states with specific metrics
• Identity Alignment: Position reader as intelligent early adopter
• Competence Building: Make reader feel capable of implementation
• Autonomy Support: Provide choices and customization options

TOKEN OPTIMIZATION STRATEGIES:
• Precise Language: Eliminate redundant words and filler [36]
• Strategic Abbreviations: Use widely recognized acronyms [36]
• Structured Formatting: Leverage bullets and numbered lists for clarity [36]
• Dual-Channel Processing: Combine visual symbols with text content [18]
• Cognitive Load Reduction: Maintain 7±2 information chunks per concept [18]

Return ONLY valid JSON: [{"content": "educational post with viral psychology triggers", "characterCount": exact_count}]`
},
{
    role: "user",
    content: `Generate ${postCount} posts about "${prompt}" optimized for viral educational impact.

PERFORMANCE REQUIREMENTS:
📊 Exactly ${postCount} posts, 270-280 characters each
📊 Tone: ${tone} with authoritative expertise and genuine helpfulness
📊 Dual optimization: Maximum shareability + transformational learning value

EDUCATIONAL IMPACT CRITERIA (Priority Level 1):
🎓 Actionable Knowledge Transfer:
• Include specific techniques with implementation steps
• Provide measurable outcomes and success metrics
• Explain underlying mechanisms (the scientific WHY)
• Address common failure modes and prevention strategies
• Connect to broader frameworks and mental models

🎓 Cognitive Engagement Optimization:
• Activate prior knowledge through pattern recognition
• Create meaningful connections to existing schemas [15]
• Promote metacognitive awareness through reflection prompts
• Support different learning preferences with varied approaches
• Enable immediate application through concrete examples

VIRAL PSYCHOLOGY INTEGRATION (Priority Level 2):
🔥 Neurological Trigger Activation:
• Open with research-backed contradictions or surprises
• Use specific statistics from credible institutions
• Generate curiosity gaps resolved within the post
• Include social proof from real studies and outcomes
• Create identity-aligned sharing motivations [5][26]

🔥 Emotional Resonance Engineering:
• Target high-arousal positive emotions (awe, surprise, admiration) [2][10]
• Build reciprocity through immediate valuable insights [6]
• Generate social currency through exclusive knowledge [5]
• Activate loss aversion through missed opportunity framing
• Enable superiority positioning through insider information

AUTHENTICITY AND CREDIBILITY STANDARDS:
🎯 Evidence-Based Foundation:
• Reference real studies from named institutions [15][16][17]
• Include actual percentages, sample sizes, and timeframes
• Attribute insights to recognized experts and researchers
• Provide honest assessment of limitations and contexts [22]
• Distinguish between correlation and causation in claims

🎯 Implementation Integrity:
• Specify exact tools, platforms, and methodologies
• Include realistic timelines and resource requirements
• Address prerequisite knowledge and skill levels
• Provide troubleshooting guidance for common obstacles [17]
• Connect individual techniques to systematic approaches

PSYCHOLOGICAL ARCHITECTURE TEMPLATES:

RESEARCH REVELATION: "[Institution] studied [#] [subjects] and found [counterintuitive result]. The reason: [mechanism]. Try: [specific technique]. [Engagement question]?"

EXPERT CONTRADICTION: "Most [field] experts teach [common belief], but [named authority] discovered [opposite truth]. Here's why: [explanation + implementation]. [Reflection prompt]?"

INSIDER METHODOLOGY: "After analyzing [#] [outcomes], the real pattern isn't [assumption] - it's [actual finding]. The method: [steps]. [Application question]?"

FAILURE ANALYSIS: "Why [common approach] backfires: [research finding]. [Authority] found [better method] increases [metric] by [%]. Try: [technique]. [Implementation query]?"

OPTIMIZATION SPECIFICATIONS:
• Character efficiency: Eliminate redundant words while preserving meaning [36]
• Cognitive load management: Present 3-5 key concepts maximum per post [18]
• Dual-channel engagement: Use symbols and formatting for visual processing
• Memory activation: Include specific examples that create vivid mental imagery
• Action orientation: End with clear next steps or reflection prompts

Each post must simultaneously trigger viral sharing psychology AND deliver genuine knowledge that transforms the reader's understanding or capabilities. Success metric: Reader bookmarks for reference AND shares for social currency.`
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