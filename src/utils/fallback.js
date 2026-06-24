export function createAuthenticFallback(topic, index, total, PostType) {
    const totalNumberedPosts = PostType !== 'single' ? total - 1 : 0;
    const isHookPost = index === 0;
    const threadPrefix = (!isHookPost && PostType !== 'single') ? `${index}/${totalNumberedPosts} ` : '';
    const templates = [
        {
            pattern: "practical_insight",
            template: `THIS IS A FALLBACK ${threadPrefix}Most people overcomplicate ${topic}.\n\nThe truth: Simple systems beat complex ones.\n\nStart with one clear goal, one daily action, one weekly review.\n\nComplexity is the enemy of execution.`
        },
        {
            pattern: "actionable_wisdom",
            template: `${threadPrefix}The ${topic} advice nobody talks about:\n\nStop optimizing. Start doing.\n\n• Perfect plans fail\n• Imperfect action wins\n• Consistency beats intensity\n\nProgress over perfection, always.`
        },
        {
            pattern: "mindset_shift",
            template: `${threadPrefix}${topic} mindset shift:\n\nFrom: "I need more tools"\nTo: "I need better habits"\n\nThe best system is the one you actually use.\n\nStart simple. Stay consistent.`
        }
    ];
    let template = templates[index % templates.length];
    if (isHookPost && PostType !== 'single') {
        template = {
            pattern: "hook",
            template: `Struggling with ${topic}? Here's a step-by-step breakdown with real examples and actionable tips 🧵`
        };
    }
    return {
        content: template.template,
        characterCount: template.template.length,
        postNumber: index + 1,
        coreInsight: template.pattern,
        actionableElement: "immediate implementation",
        authentic: true,
        fallback: true,
        message: "This is a fallback response - please try again for original, high-value content"
    };
}
//# sourceMappingURL=fallback.js.map