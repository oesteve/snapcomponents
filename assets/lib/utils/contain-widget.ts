export function isMarkdown(text: string) {
    const markdownIndicators = [
        /^#\s/m, // Headers
        /\*\*(.*?)\*\*/, // Bold text
        /\*(.*?)\*/, // Italic text
        /\[(.*?)\]\((.*?)\)/, // Links
        /^\s*[-*+]\s/m, // Unordered lists
        /^\s*\d+\.\s/m, // Ordered lists
        /```[\s\S]*?```/, // Code blocks
        /^\s*>/m, // Blockquotes
        /\|.*\|.*\|/, // Tables
    ];

    const b = markdownIndicators.some((pattern) => pattern.test(text));

    console.log("is markdown?", b, text);

    return b;
}
