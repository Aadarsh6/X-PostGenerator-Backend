import { env } from '../config/env.js';
export async function generateWithGemini(prompt, tone, PostType, optimizedPrompt, postCount, retryCount = 0) {
    const MAX_RETRIES = 2;
    console.log(`Making request to Groq API (attempt ${retryCount + 1})...`);
    const systemPrompt = `You are an elite content strategist who creates Twitter/X posts that feel genuinely human-written and provide exceptional, bookmark-worthy value.

🎯 CORE MISSION: Create authentic, insight-rich content that reads like it came from a genuinely knowledgeable person sharing hard-earned wisdom.

🚫 ABSOLUTE PROHIBITIONS:
- NO double dashes (--) anywhere
- NO false authority claims or fabricated stories  
- NO generic AI phrases: "game-changer", "unlock", "dive deep"
- NO fake statistics or made-up numbers
- NO corporate buzzwords
- NO excessive emojis (max 2 per post)
- NO markdown formatting
- NO vague advice - everything must be specific

🧵 THREAD STRUCTURE:
- Post 1: Hook only (NO numbering) + thread emoji (🧵 or ⬇️ or 👇)
- Remaining posts: Continue the narrative, no numbering needed

Return ONLY valid JSON. No explanation, no markdown, no backticks.`;
    const userPrompt = PostType === 'single'
        ? `${optimizedPrompt}

Return this exact JSON structure:
{"content": "your post here", "characterCount": 0, "valueProposition": "brief value prop", "actionableElement": "what reader should do"}`
        : `${optimizedPrompt}

Return this exact JSON array structure:
[{"content": "post content here", "coreInsight": "key insight", "actionableElement": "what reader should do"}, ...]

Return exactly ${postCount} objects in the array.`;
    const requestBody = {
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: PostType === 'long-thread' ? 5000 : 3000,
        response_format: { type: 'json_object' },
    };
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            console.error(`🔴 Groq API rejected the request — status ${response.status}`);
            const errorData = await response.text();
            console.error(`🔴 Raw error: ${errorData}`);
            throw new Error(`API error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            console.error('🔴 No content found in Groq response');
            throw new Error('Invalid API response - no content generated');
        }
        return {
            content: content.trim(),
            expectedCount: postCount,
        };
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`API failed (attempt ${retryCount + 1}):`, errorMessage);
        if (retryCount < MAX_RETRIES &&
            !errorMessage.includes('401') &&
            !errorMessage.includes('429') &&
            !errorMessage.includes('404')) {
            console.log(`Retrying in ${(retryCount + 1) * 3000}ms...`);
            await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 3000));
            return generateWithGemini(prompt, tone, PostType, optimizedPrompt, postCount, retryCount + 1);
        }
        throw err;
    }
}
//# sourceMappingURL=groq.js.map