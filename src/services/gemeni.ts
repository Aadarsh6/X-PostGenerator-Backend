import { env } from '../config/env.js';
import { TWITTER_CONTENT_STRATEGIST } from './promptBuilder.js';

export interface GeminiResponse {
  content: string;
  expectedCount: number;
}

export async function generateWithGemini(
  prompt: string, 
  tone: string, 
  PostType: string,
  optimizedPrompt: string,
  postCount: number,
  retryCount: number = 0
): Promise<GeminiResponse> {
  const MAX_RETRIES = 2;
  
  console.log(`Making request to Gemini API (attempt ${retryCount + 1})...`);
  
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: optimizedPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: TWITTER_CONTENT_STRATEGIST }]
    },
    generationConfig: {
  temperature: 0.7,
  maxOutputTokens: PostType === 'long-thread' ? 5000 : 3000,
  thinkingConfig: {
  thinkingBudget: 0
},
  responseMimeType: "application/json",
  responseSchema: PostType === 'single'
    ? {
        type: "OBJECT",
        properties: {
          content: { type: "STRING" },
          characterCount: { type: "INTEGER" },
          valueProposition: { type: "STRING" },
          actionableElement: { type: "STRING" }
        },
        required: ["content"]
      }
    : {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            content: { type: "STRING" },
            coreInsight: { type: "STRING" },
            actionableElement: { type: "STRING" }
          },
          required: ["content"]
        }
      }
}
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
        //   "Authorization": `Bearer ${env.GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {

        console.error(`🔴 Gemini API rejected the request — status ${response.status}`);
        const errorData = await response.text();
        console.error(`🔴 Raw error: ${errorData}`);
        throw new Error(`API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    // console.log('🔍 RAW GEMINI RESPONSE:', JSON.stringify(data, null, 2));

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
 console.error('🔴 No content found in response. Finish reason:', data.candidates?.[0]?.finishReason);
  throw new Error('Invalid API response - no content generated');    }
    
    return {
      content: content.trim(),
      expectedCount: postCount
    };
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`API failed (attempt ${retryCount + 1}):`, errorMessage);

    if (retryCount < MAX_RETRIES && !errorMessage.includes('401')) {
      console.log(`Retrying in ${(retryCount + 1) * 1000}ms...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
      return generateWithGemini(prompt, tone, PostType, optimizedPrompt, postCount, retryCount + 1);
    }

    throw err;
  }
}