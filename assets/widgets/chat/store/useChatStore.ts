import { create } from "zustand";
import {
    getChat,
    sendMessage,
    createNewChat,
    clearMessages,
    type Chat,
} from "@/widgets/chat/lib/chat.ts";

interface ChatState {
    chat: Chat | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    newChat: Chat | null;
    isOpen: boolean;
    isExpanded: boolean;

    // Actions
    fetchChat: () => Promise<void>;
    sendMessage: (request: { content: string }) => Promise<void>;
    createChat: () => Promise<void>;
    clearMessages: () => Promise<void>;
    openChat: () => void;
    closeChat: () => void;
    expandChat: () => void;
    collapseChat: () => void;
    toggleExpanded: () => void;
}

export const useChatStoreBase = create<ChatState>((set, get) => ({
    chat: null,
    isLoading: false,
    isError: false,
    error: null,
    newChat: null,
    isOpen: false,
    isExpanded: false,

    fetchChat: async () => {
        set({ isError: false, error: null });
        try {
            const chat = await getChat();
            set({ chat });
        } catch (error) {
            set({ isError: true, error: error as Error });
        }
    },

    sendMessage: async (request: { content: string }) => {
        set({ isLoading: true, isError: false, error: null });

        // Optimistic update
        const previousChat = get().chat;
        if (previousChat) {
            set({
                chat: {
                    ...previousChat,
                    messages: [
                        ...previousChat.messages,
                        {
                            id: Date.now(), // Temporary ID
                            role: "user",
                            content: request.content,
                        },
                    ],
                },
            });
        }

        try {
            const updatedChat = await sendMessage(request);
            set({ chat: updatedChat, isLoading: false });
        } catch (error) {
            // Rollback on error
            set({
                chat: previousChat,
                isError: true,
                error: error as Error,
                isLoading: false,
            });
        }
    },

    createChat: async () => {
        set({ isLoading: true, isError: false, error: null });

        // Optimistic update
        const previousChat = get().chat;
        if (previousChat) {
            set({
                chat: {
                    ...previousChat,
                    messages: [],
                },
            });
        }

        try {
            const newChat = await createNewChat();
            set({ chat: newChat, newChat, isLoading: false });
        } catch (error) {
            // Rollback on error
            set({
                chat: previousChat,
                isError: true,
                error: error as Error,
                isLoading: false,
            });
        }
    },

    clearMessages: async () => {
        set({ isLoading: true, isError: false, error: null });
        try {
            const chat = await clearMessages();
            set({ chat, isLoading: false });
        } catch (error) {
            set({ isError: true, error: error as Error, isLoading: false });
        }
    },

    openChat: () => {
        set({ isOpen: true });
    },

    closeChat: () => {
        set({ isOpen: false, isExpanded: false });
    },

    expandChat: () => {
        set({ isExpanded: true });
    },

    collapseChat: () => {
        set({ isExpanded: false });
    },

    toggleExpanded: () => {
        set((state) => ({ isExpanded: !state.isExpanded }));
    },
}));
