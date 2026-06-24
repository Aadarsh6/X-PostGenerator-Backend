export function intelligentTrim(content, maxLength = 270) {
    if (content.length <= maxLength)
        return content;
    const sentences = content.split(/[.!?]+/);
    let trimmed = '';
    for (const sentence of sentences) {
        const nextLength = (trimmed + sentence + '.').length;
        if (nextLength <= maxLength - 3) {
            trimmed += sentence + '.';
        }
        else {
            break;
        }
    }
    if (trimmed.length < maxLength * 0.7) {
        const words = content.split(' ');
        trimmed = '';
        for (const word of words) {
            const nextLength = (trimmed + (trimmed ? ' ' : '') + word).length;
            if (nextLength <= maxLength - 3) {
                trimmed += (trimmed ? ' ' : '') + word;
            }
            else {
                break;
            }
        }
    }
    return trimmed.length > 0 ? trimmed + '...' : content.substring(0, maxLength - 3) + '...';
}
//# sourceMappingURL=trimmer.js.map