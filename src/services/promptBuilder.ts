import type { Tone, PostType } from '../types/index.js';

export const TWITTER_CONTENT_STRATEGIST = `You are an elite content strategist who creates Twitter/X posts that feel genuinely human-written and provide exceptional, bookmark-worthy value.

🎯 CORE MISSION: Create authentic, insight-rich content that reads like it came from a genuinely knowledgeable person sharing hard-earned wisdom.

🚫 ABSOLUTE PROHIBITIONS:
• NO double dashes (--) anywhere - use periods, commas only
• NO false authority claims or fabricated stories
• NO generic AI phrases: "game-changer", "unlock", "dive deep"
• NO fake statistics or made-up numbers
• NO corporate buzzwords
• NO excessive emojis (max 2 per post)
• NO markdown formatting
• NO vague advice - everything must be specific

🔢 THREAD NUMBERING:
• Post 1: Hook only (NO numbering) + thread emoji (🧵 or ⬇️ or 👇)
• Posts 2-N: Numbered as "1/X, 2/X, 3/X" where X = postCount - 1
• Example for 6-post: Post 1 (no number), Post 2 (1/5), Post 3 (2/5)... Post 6 (5/5)

Return valid JSON exactly as specified in the user prompt.`;

export function createOptimizedPrompt(
  prompt: string, 
  tone: Tone, 
  postCount: number, 
  PostType: PostType
): string {
  const totalNumberedPosts = PostType !== 'single' ? postCount - 1 : 0;
  
  const toneInstructions = {
    'professional': 'Use authoritative, expert tone with industry insights',
    'humorous': 'Use sharp humor, clever and witty observations',
    'educational': 'Break down complex topics into simple concepts',
    'controversial': 'Challenge popular beliefs with provocative viewpoints',
    'casual': 'Use friendly, conversational tone',
    'inspirational': 'Use powerful, motivational language'
  };

  const typeInstructions = {
    'single': 'Create ONE high-impact post (240-270 characters)',
    'thread': `Create a ${postCount}-post thread building complete narrative`,
    'long-thread': `Create comprehensive ${postCount}-post thread with deep insights`
  };

  return `Create ${PostType === 'single' ? 'a single post' : `a ${postCount}-post thread`} about: "${prompt}"

TONE: ${toneInstructions[tone] || toneInstructions.professional}
FORMAT: ${typeInstructions[PostType]}

CRITICAL REQUIREMENTS:
- ${tone.toUpperCase()} tone throughout
- Each post under 280 characters
- NO double dashes (--) - use periods/commas
- No em dash (-) use 
- Provide actionable value

${PostType !== 'single' ? `
THREAD STRUCTURE:
- Post 1: Hook + thread emoji (🧵) - NO NUMBERING
- Posts 2-${postCount}: Numbered 1/${totalNumberedPosts} to ${totalNumberedPosts}/${totalNumberedPosts}
- Final post: Specific actionable next step
` : ''}

Return JSON format as specified.`;
}