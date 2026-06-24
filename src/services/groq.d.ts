export interface GeminiResponse {
    content: string;
    expectedCount: number;
}
export declare function generateWithGemini(prompt: string, tone: string, PostType: string, optimizedPrompt: string, postCount: number, retryCount?: number): Promise<GeminiResponse>;
//# sourceMappingURL=groq.d.ts.map