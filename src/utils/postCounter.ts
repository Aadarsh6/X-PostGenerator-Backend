import type { PostType } from "../types/index.js";

export function getPostCount(PostType: PostType): number {
  const counts = {
    'single': 1,
    'thread': Math.floor(Math.random() * 4) + 2,
    'long-thread': Math.floor(Math.random() * 5) + 6
  };
  return counts[PostType] || 1;
}