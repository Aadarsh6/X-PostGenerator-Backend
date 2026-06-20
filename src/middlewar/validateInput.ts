import type { Request, Response, NextFunction } from 'express';
import type { PostType, Tone } from '../types/index.js';

const validTones: Tone[] = ['professional', 'humorous', 'educational', 'controversial', 'casual', 'inspirational'];
const validPostTypes: PostType[] = ['single', 'thread', 'long-thread'];

export function validateInput(req: Request, res: Response, next: NextFunction) {
  const { prompt, tone, PostType } = req.body;
  
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required and must be a non-empty string'
    });
  }
  
  if (prompt.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Prompt must be less than 500 characters'
    });
  }
  
  if (!tone || !validTones.includes(tone)) {
    return res.status(400).json({
      success: false,
      error: `Invalid tone. Must be one of: ${validTones.join(', ')}`
    });
  }
  
  if (!PostType || !validPostTypes.includes(PostType)) {
    return res.status(400).json({
      success: false,
      error: `Invalid PostType. Must be one of: ${validPostTypes.join(', ')}`
    });
  }
  
  next();
}