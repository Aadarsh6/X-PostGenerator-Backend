export function validateEnv() {
    const port = parseInt(process.env.PORT || '3001', 10);
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is required in .env file');
    }
    return {
        PORT: port,
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        NODE_ENV: nodeEnv,
    };
}
export const env = validateEnv();
//# sourceMappingURL=env.js.map