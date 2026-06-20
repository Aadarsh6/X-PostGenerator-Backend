export interface EnvConfig {
  PORT: number;
//   PERPLEXITY_API_KEY: string | null;
  GEMINI_API_KEY: string | null;
  NODE_ENV: string;
}

export function validateEnv(): EnvConfig {
  const port = parseInt(process.env.PORT || '3001', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

//   if (apiProvider === 'perplexity' && !process.env.PERPLEXITY_API_KEY) {
//     console.warn('⚠️  PERPLEXITY_API_KEY not set - API will fail');
//   }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required in .env file');
  }


  return {
    PORT: port,
    // PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || null,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || null,
    NODE_ENV: nodeEnv,
  };
}

export const env = validateEnv();