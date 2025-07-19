/**
 * React Query keys used in the chat widget
 */

export const chatKeys = {
    all: ["chat"] as const,
    chat: () => [...chatKeys.all] as const,
};
