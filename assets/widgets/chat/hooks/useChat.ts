import { useChatStore } from "@/widgets/chat/store/useChatStore.ts";
import { useEffect } from "react";

export function useChat() {
    const {
        chat,
        newChat,
        isLoading,
        isError,
        error,
        isOpen,
        fetchChat,
        sendMessage,
        createChat,
        clearMessages,
        openChat,
        closeChat,
    } = useChatStore();

    // Fetch chat data on component mount
    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    return {
        chat: chat || newChat,
        isLoading,
        isError,
        error,
        isOpen,
        refetch: fetchChat,
        createChat,
        sendMessage,
        clearMessages,
        openChat,
        closeChat,
    };
}
