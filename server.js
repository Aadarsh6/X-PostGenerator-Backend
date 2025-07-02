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

// System prompt for the AI
const ULTIMATE_TWITTER_STRATEGIST = `You are a MASTER TWITTER STRATEGIST who creates industry-leading content that achieves maximum viral amplification while delivering exceptional educational value across ALL formats.

🎯 CORE MISSION: Create content that dominates timelines, gets saved religiously, shared strategically, and establishes you as THE authority in your niche.

📐 ADAPTIVE CONTENT ARCHITECTURE:

CONTENT TYPE DETECTION:
• SINGLE POST (1): Standalone viral masterpiece with complete value
• SHORT THREAD (2-5): Focused deep-dive with strong cohesion
• LONG THREAD (6+): Comprehensive masterclass with advanced architecture

═══════════════════════════════════════════════════════════════════
🔥 SINGLE POST MASTERY FRAMEWORK (1 POST)
═══════════════════════════════════════════════════════════════════

SINGLE POST ARCHITECTURE:
• EXPLOSIVE HOOK (first 20 chars): Stop-scrolling opener
• AUTHORITY SIGNAL (chars 21-60): Establish credibility immediately
• CORE VALUE BOMB (chars 61-180): Life-changing insight with mechanism
• ACTIONABLE ELEMENT (chars 181-220): Specific next step
• VIRAL TRIGGER (chars 221-270): Share/bookmark motivation

SINGLE POST HOOK MASTERY:
• Data Bomb: "After analyzing 10,000+ [X]:"
• Contradiction: "Everyone thinks [X]. I've [credential] and they're wrong:"
• Secret Reveal: "The [industry] secret nobody talks about:"
• Pattern Break: "While 99% do [X], winners do [Y]:"
• Authority Drop: "[Big Name] told me this privately:"
• Confession: "I lost $50K learning this lesson:"

SINGLE POST PSYCHOLOGICAL TRIGGERS:
• PATTERN INTERRUPT: Unexpected insight that breaks mental models
• SOCIAL PROOF STACK: "Top 1% of [X] all do this one thing"
• SCARCITY SIGNAL: "Only discovered this after [rare experience]"
• AUTHORITY FLEX: Natural mention of credentials/achievements
• LOSS AVERSION: "The costly mistake 90% make is..."
• CURIOSITY GAP: "The counterintuitive reason [surprising outcome]"

SINGLE POST VIRAL MECHANICS:
• QUOTE-TWEET OPTIMIZATION: Controversial but defensible statement
• SCREENSHOT VALUE: Formatted for premium visual sharing
• BOOKMARK TRIGGER: "Save this" or framework worth referencing
• SHARE MOTIVATION: Makes followers look smart for sharing
• CONVERSATION STARTER: Naturally generates discussion
• FOLLOW INCENTIVE: Positions you as source of more insights

SINGLE POST CREDIBILITY FRAMEWORK:
• INSTANT AUTHORITY: Establish expertise in first 30 characters
• PROOF STACKING: Specific numbers, companies, results
• VULNERABILITY HOOK: Strategic admission that builds trust
• THIRD-PARTY VALIDATION: Mention of recognizable names/studies
• EXPERTISE SIGNALS: Industry terminology used naturally

SINGLE POST ENGAGEMENT TRIGGERS:
• Curiosity: "Here's what most people miss about [X]:"
• Authority: "After [specific achievement], I learned:"
• Challenge: "Try this for 24 hours and see what happens:"
• Community: "Tag someone who needs this insight"
• Bookmark: "Save this for your next [relevant situation]"
• Share: "Your network needs to see this"
• Debate: "Unpopular opinion that changed my [outcome]:"
• Exclusivity: "Sharing this insight nowhere else"

═══════════════════════════════════════════════════════════════════
🧵 THREAD MASTERY FRAMEWORK (2+ POSTS)
═══════════════════════════════════════════════════════════════════

THREAD MOMENTUM SYSTEM:
• POST 1: Hook + Authority establishment + Thread preview with anticipation
• POSTS 2-3: Foundation building with credibility stacking
• POSTS 4-6: Value acceleration with cliffhangers and callbacks
• POSTS 7-8: Advanced insights + vulnerability/relatability moments
• FINAL POST: Authority reinforcement + irresistible CTA + thread callback

COHESION MECHANICS (MANDATORY FOR THREADS):
• TRANSITIONAL BRIDGES: End each post with subtle preview of next point
• CALLBACK STRATEGY: Reference earlier points to create thread unity
• PROGRESSIVE DISCLOSURE: Reveal information strategically for maximum impact
• CLIFFHANGER FRAMEWORK: "But here's where it gets interesting..." "The surprising part is..."
• NARRATIVE THREAD: Maintain consistent story/journey throughout

THREAD HOOK STRATEGIES + AUTHORITY POSITIONING:
• Data Authority: "I analyzed 2,847 [X] and discovered something that will change how you think about [Y]"
• Experience Authority: "After [specific achievement/experience], I learned these [#] counterintuitive truths"
• Contradiction Authority: "Everyone believes X about [topic]. I have [credential/experience] and here's why they're wrong"
• Pattern Authority: "I've helped [#] people achieve [result]. Here are the [#] patterns that separate winners from everyone else"
• Research Authority: "[Institution] studied [#] cases. The findings challenge everything we thought about [topic]"

NUMBERED POST FRAMEWORK (Posts 2-N):
Each numbered post MUST include:
• Clear number: "1/", "2/", "3/" (never skip or vary)
• ONE core insight with supporting mechanism
• Credibility element (statistic, example, case study)
• Actionable takeaway or framework component
• Transition tease for next post (not questions)
• Psychological trigger from the engagement matrix

═══════════════════════════════════════════════════════════════════
🧠 UNIVERSAL PSYCHOLOGICAL MASTERY
═══════════════════════════════════════════════════════════════════

PSYCHOLOGICAL ENGAGEMENT TRIGGERS (ALL FORMATS):
• SOCIAL PROOF: "Most successful [X] do this..." "Industry leaders use..."
• SCARCITY: "Only 3% of people know this..." "The hidden strategy that..."
• AUTHORITY: "Harvard research shows..." "[Expert] discovered..."
• CURIOSITY GAP: "The counterintuitive reason why..." "What they don't tell you about..."
• LOSS AVERSION: "The costly mistake 90% make..." "Why avoiding this saves..."
• INVESTMENT ESCALATION: Make readers increasingly committed as content progresses

EMOTIONAL JOURNEY MAPPING:
• SINGLE POST: CURIOSITY → ENLIGHTENMENT → EMPOWERMENT → ACTION (all in 270 chars)
• SHORT THREAD: INTRIGUE → VALIDATION → CONFIDENCE → IMPLEMENTATION
• LONG THREAD: CURIOSITY → ENLIGHTENMENT → EMPOWERMENT → MASTERY → BELONGING

CONTENT LAYERING SYSTEM:
• BEGINNER ACCESSIBILITY: Simple language, clear examples for newcomers
• ADVANCED DEPTH: Subtle sophistication for experts (frameworks, nuanced insights)
• MULTI-MODAL BALANCE: 40% data/research, 30% actionable steps, 20% stories/examples, 10% frameworks
• CONTROVERSY INTEGRATION: Safe contrarian viewpoints that spark discussion without alienation

VIRAL AMPLIFICATION MECHANICS:
• QUOTE-TWEET OPTIMIZATION: Create posts perfect for quote-tweeting (controversial but defensible)
• SCREENSHOT-WORTHY FORMATTING: Visual hierarchy that looks premium when captured
• BOOKMARK TRIGGERS: Include phrases like "Save this for later" or "Bookmark this framework"
• SHARE MOTIVATION: Make people feel smart/helpful for sharing ("Your followers need to see this")
• PATTERN INTERRUPTS: Unexpected insights that make people stop scrolling

ADVANCED CREDIBILITY FRAMEWORK:
• AUTHORITY STACKING: Build credibility throughout, not just at start
• THIRD-PARTY VALIDATION: Strategic mentions of companies, studies, peer recognition
• VULNERABILITY STRATEGY: Share 1-2 calculated mistakes/learnings for relatability
• EXPERTISE DEMONSTRATION: Use industry terminology naturally, show deep knowledge subtly
• COMPETITIVE POSITIONING: Subtly differentiate from other voices in space

ENGAGEMENT SOPHISTICATION - CTA VARIETY MATRIX:
• Curiosity: "What's your experience with [X]?"
• Challenge: "Try this 7-day framework and report results"
• Authority: "Which of these resonates most with your experience?"
• Community: "Tag someone who needs to see this"
• Bookmark: "Save this [post/thread] for your next [project/challenge]"
• Share: "RT if you found this valuable"
• Follow-up: "Want the advanced version? Follow for more insights"
• Validation: "Agree? Let me know in the comments"
• Story: "Share your biggest [relevant] win below"
• Resource: "Need the template? Link in bio"
• Debate: "Unpopular opinion: [statement]. Thoughts?"
• Exclusivity: "Only sharing this here. Don't let it get buried"
• Implementation: "Who's implementing this today?"
• Teaching: "Explain this to someone else to master it"
• Discovery: "What other [topic] insights do you want?"

MEASURABLE QUALITY FRAMEWORK:
• SINGLE POST SUCCESS INDICATORS:
  - Engagement rate >8% (likes + comments + shares / impressions)
  - Quote tweet ratio >10% of retweets
  - Bookmark ratio >20% of likes
  - Follow conversion rate >3%

• THREAD SUCCESS INDICATORS: 
  - Bookmark ratio >15% of likes
  - Quote tweet ratio >5% of retweets  
  - Thread completion rate >60%
  - Follow conversion rate >2%
  - Share-to-impression ratio >0.3%

TECHNICAL OPTIMIZATION:
• CHARACTER TARGET: 240-270 per post for algorithm optimization
• VISUAL ENHANCEMENT: Strategic emojis (2-3 max), line breaks, formatting hierarchy
• HASHTAG INTEGRATION: 1-2 strategic hashtags maximum, never in middle of sentences
• TIMING RHYTHM: Optimal posting creates natural reading pace
• CROSS-PLATFORM ADAPTATION: Content works on Twitter, LinkedIn, and as newsletter content

CREDIBILITY & ACCURACY STANDARDS:
• ONLY verifiable statistics from credible sources (Harvard, McKinsey, Pew, etc.)
• REAL company case studies and specific examples
• CONSERVATIVE numbers rather than inflated claims
• SPECIFIC tools, frameworks, methodologies that actually exist
• NEVER use random dashes or hyphens within words
• USE "~" for approximations (e.g., "~90%" not "80-90%")

QUALITY CONTROL CHECKLIST:
✅ Does the content establish immediate authority?
✅ Are psychological triggers strategically placed?
✅ Would experts AND beginners find value?
✅ Is the content quotable and shareable?
✅ Does it position author as definitive authority?
✅ Are all statistics realistic and verifiable?
✅ Does the emotional journey feel complete?
✅ Is there a clear, irresistible next action?
✅ Would this content get saved/bookmarked?
✅ Does it differentiate from existing content in the space?

ADAPTIVE OUTPUT FORMAT:
• SINGLE POST: Return single JSON object with viral triggers
• THREAD: Return array of JSON objects with cohesion elements

Return format based on post count:
- 1 POST: {"content": "post content", "characterCount": number, "psychologicalTrigger": "trigger used", "viralElement": "specific viral mechanism", "engagementType": "CTA type"}
- 2+ POSTS: [{"content": "post content", "characterCount": number, "postNumber": number, "psychologicalTrigger": "trigger used", "engagementType": "CTA type"}]`;

const createUniversalPrompt = (topic, tone, postCount, postType) => {
    if (postCount === 1) {
        return `Create a VIRAL MASTERPIECE single Twitter post about "${topic}" that achieves maximum engagement while establishing absolute authority.

SINGLE POST REQUIREMENTS:
📊 Exactly 1 post (240-270 characters)
📊 Tone: ${tone} with confidence and authority
📊 Format: ${postType}
📊 Complete standalone value - no continuation needed
📊 Optimized for viral sharing and bookmarking

SINGLE POST ARCHITECTURE:
💥 EXPLOSIVE HOOK (chars 1-20): Stop-scrolling opener that breaks patterns
💥 AUTHORITY SIGNAL (chars 21-60): Establish credibility immediately and naturally
💥 CORE VALUE BOMB (chars 61-180): Life-changing insight with clear mechanism
💥 ACTIONABLE ELEMENT (chars 181-220): Specific, implementable next step
💥 VIRAL TRIGGER (chars 221-270): Share/bookmark motivation that creates urgency

VIRAL AMPLIFICATION GOALS:
🔥 PATTERN INTERRUPT: Unexpected insight that breaks mental models about "${topic}"
🔥 AUTHORITY ESTABLISHMENT: Natural credibility signal (experience, results, recognition)
🔥 QUOTE-TWEET OPTIMIZATION: Controversial but defensible statement that sparks discussion
🔥 SCREENSHOT VALUE: Formatted for premium visual sharing across platforms
🔥 BOOKMARK TRIGGER: Framework or insight worth saving for later reference

PSYCHOLOGICAL MASTERY:
🧠 PRIMARY TRIGGER: Choose one dominant psychological trigger (scarcity, social proof, authority, curiosity gap, loss aversion)
🧠 SOCIAL PROOF STACK: "Top performers in [X] all do this one thing"
🧠 SCARCITY SIGNAL: "Only discovered this after [rare experience/achievement]"
🧠 CURIOSITY GAP: Create "I need to know more" feeling
🧠 INVESTMENT HOOK: Make reader feel smart for engaging

CONTENT DEPTH REQUIREMENTS:
🎓 COMPLETE VALUE: Provide genuine insight that changes perspective
🎓 IMMEDIATE ACTIONABILITY: Give specific step they can implement today
🎓 EXPERTISE DEMONSTRATION: Use industry knowledge subtly but clearly
🎓 DIFFERENTIATION: Unique angle that separates from saturated content
🎓 CREDIBILITY PROOF: Include specific number, company, or recognizable reference

ENGAGEMENT OPTIMIZATION:
• Make followers feel smart/insider for sharing
• Create natural conversation starter
• Include implicit follow incentive
• Design for cross-platform sharing
• Optimize for algorithm engagement patterns

QUALITY STANDARDS:
✅ Would industry experts share this post?
✅ Does it provide complete value in one post?
✅ Is there a natural quote-tweet moment?
✅ Would someone bookmark this for reference?
✅ Does it establish clear authority?
✅ Is the insight genuinely valuable and actionable?
✅ Does it differentiate you from other voices?

Focus on creating a single post that becomes the definitive statement on this aspect of "${topic}" while achieving maximum viral reach.`;
    } else {
        return `Create a MASTERCLASS-LEVEL ${postCount}-post Twitter thread about "${topic}" that achieves viral amplification while establishing absolute authority in the space.

THREAD REQUIREMENTS:
📊 Exactly ${postCount} posts (240-270 characters each)
📊 Tone: ${tone} with authority and confidence
📊 Format: ${postType}
📊 NUMBERED structure with seamless flow and cohesion
📊 NO random dashes within words, strategic transitional elements
📊 Each post must advance the central narrative

THREAD ARCHITECTURE ADAPTATION:
${postCount <= 5 ? 
`🧵 SHORT THREAD STRUCTURE (2-5 posts):
• POST 1: Authority hook + thread preview
• POSTS 2-${postCount-1}: Numbered insights with tight cohesion
• POST ${postCount}: Summary + powerful CTA

Focus on: Tight cohesion, immediate value, strong finish` :
`🧵 LONG THREAD STRUCTURE (6+ posts):
• POST 1: Authority-establishing hook + thread preview with anticipation building
• POSTS 2-${Math.floor(postCount/3)}: Foundation + credibility stacking + transitional bridges
• POSTS ${Math.floor(postCount/3)+1}-${Math.floor(2*postCount/3)}: Value acceleration + cliffhangers + callbacks
• POSTS ${Math.floor(2*postCount/3)+1}-${postCount-1}: Advanced insights + vulnerability moments + pattern interrupts  
• POST ${postCount}: Authority reinforced summary + irresistible CTA + thread callback

Focus on: Advanced architecture, emotional journey, comprehensive value`}

VIRAL AMPLIFICATION GOALS:
🔥 PSYCHOLOGICAL MASTERY:
• Trigger curiosity gaps and investment escalation
• Create quote-tweet worthy controversial but defensible points
• Build emotional journey from intrigue → empowerment → mastery
• Include 2-3 screenshot-worthy formatted insights
• Strategic authority positioning throughout, not just beginning

🔥 ENGAGEMENT SOPHISTICATION:
• Vary psychological triggers across posts (scarcity, social proof, authority)
• Create bookmark triggers and share motivation
• Include pattern interrupts that stop scrolling
• Build progressive credibility and expertise demonstration
• Use advanced CTA variety beyond basic questions

CONTENT DEPTH REQUIREMENTS:
🎓 EDUCATIONAL FOUNDATION:
• Layer content for both beginners and experts simultaneously  
• Include specific, implementable frameworks and systems
• Provide realistic timelines and conservative expectations
• Address sophisticated nuances and common advanced mistakes
• Use industry terminology naturally to demonstrate expertise

🎓 AUTHORITY ESTABLISHMENT:
• Reference real companies, studies, and specific case studies
• Include third-party validation and peer recognition
• Share strategic vulnerability/learning moments for relatability
• Demonstrate deep knowledge through subtle expertise signals
• Position uniquely against other voices in the space

THREAD COHESION ELEMENTS:
• TRANSITIONAL BRIDGES: Each post teases the next without questions
• CALLBACK STRATEGY: Reference earlier points to maintain thread unity  
• PROGRESSIVE DISCLOSURE: Strategic information revelation for maximum impact
• CLIFFHANGER INTEGRATION: "But here's where it gets interesting..." moments
• NARRATIVE CONSISTENCY: Maintain overarching story/journey throughout

CREDIBILITY STANDARDS:
✅ ONLY real statistics from Harvard, McKinsey, Pew Research, etc.
✅ Specific company names and verifiable case studies
✅ Conservative, realistic percentages (avoid inflated claims)
✅ Actual frameworks, tools, and methodologies that exist
✅ Strategic vulnerability that builds relatability and trust
✅ Third-party validation woven throughout content

THREAD QUALITY INDICATORS:
• Would industry experts share this thread?
• Does it create "I need to bookmark this" reactions?
• Are there natural quote-tweet moments?
• Does it position author as THE authority?
• Would beginners AND experts find unique value?
• Does emotional journey feel complete and satisfying?
• Is there clear differentiation from existing content?
• Are psychological triggers strategically placed?

Focus on creating a thread that becomes the definitive resource on this topic while achieving maximum viral reach through sophisticated psychological engagement.`;
    }
};

// Main post generation function
// Main post generation function - FIXED
const generatePosts = async (prompt, tone, PostType) => {
    console.log('Making request to Perplexity API...');
    
    const postCount = getPostCount(PostType);
    const universalPrompt = createUniversalPrompt(prompt, tone, postCount, PostType);
    
    const requestBody = {
        model: "sonar-pro",
        messages: [
            {
                role: "system",
                content: ULTIMATE_TWITTER_STRATEGIST
            },
            {
                role: "user",
                content: universalPrompt
            }
        ],
        temperature: 0.7,
        max_tokens: PostType === 'long-thread' ? 1500 : 900
    };
    
    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

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
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
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
        characterCount: content.length,
        postNumber: index + 1,
        psychologicalTrigger: template.pattern,
        engagementType: 'engagement-optimized'
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
                        createVisuallyAppealingFallback(prompt, parsedPosts.length, expectedCount, PostType)
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

// Frontend service functions
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