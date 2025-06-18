//     import express from 'express';
//     import cors from 'cors';
//     import 'dotenv/config'

//     const app = express()
//     const PORT = process.env.PORT || 3001;

//     app.use(cors());
//     app.use(express.json())

//     const generatePosts = async(prompt, tone, PostType) => {
//         const response = await fetch("https://api.perplexity.ai/chat/completions", {
//             method: "POST", 
//             headers:{
//                 "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
//                 "Content-Type": "application/json"

//             },
//             body: JSON.stringify({
//                 model: 'llama-3-sonar-small-32k-online'
// ,
//                 messages: [
//                     {
//                         role: 'system',
//                         content: 'You are an expert X (Twitter) content creator. Always return valid JSON.'
//                     },
//                     {
//                         role: 'user',
//                         content: `Create ${PostType === 'single' ? '1' : '3'} engaging X posts about "${prompt}" with a ${tone} tone. Return JSON: [{"content": "text", "characterCount": number}]`
//                     }
//                 ],
//                 temperature: 0.8,
//                 max_tokens: 1000
//             })
            
        
//         })
//         if (!response.ok) {
//             throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data.choices[0].message.content.trim();
//     };

//     // API endpoint
//     app.post('/api/generate-posts', async (req, res) => {
//         try {
//             const { prompt, tone, PostType } = req.body;

//             if (!prompt || !tone || !PostType) {
//                 return res.status(400).json({ error: 'Missing required fields: prompt, tone, PostType' });
//             }

//             console.log(`Generating ${PostType} posts for: "${prompt}" with ${tone} tone`);

//             const aiResponse = await generatePosts(prompt, tone, PostType);
            
//             let parsedPosts;
//             try {
//                 // Clean the response to extract JSON
//                 const cleanedResponse = aiResponse
//                     .replace(/```json\n?|\n?```/g, '')
//                     .replace(/^[^[{]*/, '')
//                     .replace(/[^}\]]*$/, '')
//                     .trim();
                
//                 parsedPosts = JSON.parse(cleanedResponse);
//             } catch (parseError) {
//                 console.warn('Failed to parse AI response, using fallback:', parseError.message);
//                 // Fallback posts if parsing fails
//                 const fallbackPosts = PostType === 'single' ? 1 : 3;
//                 parsedPosts = Array.from({ length: fallbackPosts }, (_, i) => ({
//                     content: `Exploring ${prompt} with a ${tone} perspective! 🚀 #${prompt.replace(/\s+/g, '').substring(0, 20)}`,
//                     characterCount: 60 + prompt.length
//                 }));
//             }

//             // Ensure it's an array
//             if (!Array.isArray(parsedPosts)) {
//                 parsedPosts = [parsedPosts];
//             }

//             // Validate character counts and update if needed
//             parsedPosts = parsedPosts.map(post => ({
//                 ...post,
//                 characterCount: post.content.length
//             }));

//             res.json({
//                 success: true,
//                 posts: parsedPosts,
//                 metadata: { 
//                     prompt, 
//                     tone, 
//                     PostType,
//                     model: 'llama-3.1-sonar-small-128k-online'
//                 }
//             });

//         } catch (error) {
//             console.error('Error generating posts:', error);
//             res.status(500).json({ 
//                 error: 'Failed to generate posts',
//                 details: error.message 
//             });
//         }
//     });

//     // Health check endpoint
//     app.get('/api/health', (req, res) => {
//         res.json({ status: 'OK', service: 'X Post Generator Backend' });
//     });

//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on port ${PORT}`);
//         console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-posts`);
//     });


//     // backend/.env
//     // PERPLEXITY_API_KEY=your_perplexity_api_key_here
//     // PORT=3001

//     // services/backendService.js - Frontend service
//     const API_BASE_URL = process.env.NODE_ENV === 'production' 
//         ? 'https://your-production-url.com' 
//         : 'http://localhost:3001';

//     export const generateXPosts = async (prompt, tone, PostType) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/api/generate-posts`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     prompt: prompt.trim(),
//                     tone,
//                     PostType
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || `HTTP error! status: ${response.status}`);
//             }

//             return data;

//         } catch (error) {
//             console.error('Error calling backend:', error);
//             return {
//                 success: false,
//                 error: error.message,
//                 posts: []
//             };
//         }
//     };

//     // Test the health endpoint
//     export const checkBackendHealth = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/api/health`);
//             return await response.json();
//         } catch (error) {
//             console.error('Backend health check failed:', error);
//             return { status: 'ERROR', error: error.message };
//         }
//     };
import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors());
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
                content: "You are an expert X (Twitter) content creator. Always return valid JSON format only."
            },
            {
                role: "user",
                content: `Create exactly ${postCount} engaging X (Twitter) posts about "${prompt}" with a ${tone} tone. 

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${postCount} posts (this is ${PostType === 'single' ? 'a single post' : `a ${PostType.replace('-', ' ')} with ${postCountDescription} posts`})
- Each post MUST be under 280 characters (including spaces, hashtags, emojis)
- Count characters carefully before responding
- If a post exceeds 280 characters, make it shorter
- Include relevant hashtags and emojis when appropriate
- Make posts engaging and shareable
${PostType !== 'single' ? `- For threads, make posts flow together as a cohesive story/argument
- Number the posts if it's a thread (1/N, 2/N, etc.)` : ''}

Return ONLY valid JSON: [{"content": "post text here", "characterCount": actual_character_count}]`
            }
        ],
        temperature: 0.8,
        max_tokens: PostType === 'long-thread' ? 1000 : 500 // More tokens for longer threads
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
            console.warn('Failed to parse AI response, using fallback:', parseError.message);
            console.log('Original AI Response:', aiResponse);
            
            // Fallback posts with correct count
            parsedPosts = Array.from({ length: expectedCount }, (_, i) => ({
                content: `${PostType !== 'single' ? `${i + 1}/${expectedCount} ` : ''}Exploring ${prompt} with a ${tone} perspective! 🚀 #${prompt.replace(/\s+/g, '').substring(0, 20)}`,
                characterCount: 60 + prompt.length + (PostType !== 'single' ? 8 : 0)
            }));
        }

        // Ensure it's an array
        if (!Array.isArray(parsedPosts)) {
            parsedPosts = [parsedPosts];
        }

        // Ensure we have the right number of posts
        if (parsedPosts.length !== expectedCount) {
            console.warn(`Expected ${expectedCount} posts but got ${parsedPosts.length}. Adjusting...`);
            
            if (parsedPosts.length < expectedCount) {
                // Add more posts
                const additionalPosts = expectedCount - parsedPosts.length;
                for (let i = 0; i < additionalPosts; i++) {
                    const postNumber = parsedPosts.length + i + 1;
                    parsedPosts.push({
                        content: `${PostType !== 'single' ? `${postNumber}/${expectedCount} ` : ''}More insights on ${prompt} with a ${tone} approach! 💡`,
                        characterCount: 50 + prompt.length + (PostType !== 'single' ? 8 : 0)
                    });
                }
            } else if (parsedPosts.length > expectedCount) {
                // Trim excess posts
                parsedPosts = parsedPosts.slice(0, expectedCount);
            }
        }

        // Validate character counts and update if needed
        parsedPosts = parsedPosts.map((post, index) => {
            const actualCount = post.content ? post.content.length : 0;
            const isOverLimit = actualCount > 280;
            
            if (isOverLimit) {
                console.warn(`Post ${index + 1} exceeds 280 characters (${actualCount}): ${post.content.substring(0, 50)}...`);
                // Truncate if over limit
                const truncated = post.content.substring(0, 277) + '...';
                return {
                    ...post,
                    content: truncated,
                    characterCount: truncated.length,
                    withinLimit: true
                };
            }
            
            return {
                ...post,
                characterCount: actualCount,
                withinLimit: actualCount <= 280
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
                model: 'llama-3.1-sonar-small-128k-online'
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
        service: 'X Post Generator Backend',
        hasApiKey: !!process.env.PERPLEXITY_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-post`);
    console.log(`🔑 API Key configured: ${!!process.env.PERPLEXITY_API_KEY}`);
});

// services/backendService.js - Frontend service
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