import type { Post } from "../types/index.js";

export function validateThreadNumbering(posts: Post[], expectedPostCount: number): boolean {
  if (posts.length !== expectedPostCount) {
    throw new Error(`Expected ${expectedPostCount} posts, got ${posts.length}`);
  }

  const totalNumberedPosts = expectedPostCount - 1;

  const hookPost = posts[0];
  if ((hookPost?.content ?? "").match(/\d+\/\d+/)) {
    throw new Error("Hook post contains numbering - should be clean");
  }

  for (let i = 1; i < posts.length; i++) {
    const post = posts[i];
    const expectedNumber = `${i}/${totalNumberedPosts}`;

    if (!(post?.content ?? "").includes(expectedNumber)) {
      throw new Error(`Post ${i + 1} should contain "${expectedNumber}", but doesn't`);
    }
  }

  return true;
}

export function fixNumberingInPosts(posts: Post[], expectedCount: number): Post[] {
  const totalNumberedPosts = expectedCount - 1;

  return posts.map((post, index) => {
    const content = (post.content ?? "").replace(/^\d+\/\d+\s*/, "").trim();

    if (index === 0) {
      return {
        ...post,
        content,
      };
    }

    const correctNumber = `${index}/${totalNumberedPosts}`;

    return {
      ...post,
      content: `${correctNumber} ${content}`,
    };
  });
}