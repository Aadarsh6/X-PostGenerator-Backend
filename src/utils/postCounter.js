export function getPostCount(PostType) {
    const counts = {
        'single': 1,
        'thread': Math.floor(Math.random() * 4) + 2,
        'long-thread': Math.floor(Math.random() * 5) + 6
    };
    return counts[PostType] || 1;
}
//# sourceMappingURL=postCounter.js.map