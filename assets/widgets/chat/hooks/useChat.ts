import { useQuery } from "@tanstack/react-query";
import { getChat } from "@/widgets/chat/lib/chat.ts";
import { chatKeys } from "@/widgets/chat/lib/queryKeys.ts";
import { useNewChat } from "@/widgets/chat/hooks/useNewChat.ts";
import { useSendMessage } from "@/widgets/chat/hooks/useSendMessage.ts";

export function useChat() {
    const chatQuery = useQuery({
        queryFn: () => getChat(),
        queryKey: chatKeys.chat(),
    });

    const {
        createChat,
        isLoading: isCreatingChat,
        isError: isCreateError,
        error: createError,
        newChat,
    } = useNewChat();

    const {
        sendMessage,
        isLoading: isSendingMessage,
        isError: isSendError,
        error: sendError,
    } = useSendMessage();

    return {
        chat: chatQuery.data || newChat,
        isLoading: chatQuery.isLoading || isCreatingChat || isSendingMessage,
        isError: chatQuery.isError || isCreateError || isSendError,
        error: chatQuery.error || createError || sendError,
        refetch: chatQuery.refetch,
        createChat,
        sendMessage,
    };
}
