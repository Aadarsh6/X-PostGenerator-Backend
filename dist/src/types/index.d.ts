import type { Request } from "express";
export type Tone = 'professional' | 'humorous' | 'educational' | 'controversial' | 'casual' | 'inspirational';
export type PostType = 'single' | 'thread' | 'long-thread';
export interface GeneratePostRequest {
    prompt: string;
    tone: Tone;
    PostType: PostType;
}
export interface Post {
    content: string;
    characterCount: number;
    postNumber: number;
    coreInsight: string;
    actionableElement: string;
    authentic?: boolean;
    fallback?: boolean;
    message?: string;
    withinLimit?: boolean;
    wasTruncated?: boolean;
    originalLength?: number;
}
export interface GeneratePostResponse {
    success: boolean;
    posts: Post[];
    metadata: {
        prompt: string;
        tone: Tone;
        PostType: PostType;
        expectedCount: number;
        actualCount: number;
        totalNumberedPosts: number;
        model: string;
        version: string;
        timestamp: string;
    };
}
export interface AuthRequest extends Request {
    userId?: string;
}
//# sourceMappingURL=index.d.ts.map