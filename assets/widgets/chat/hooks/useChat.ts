import { useQuery } from "@tanstack/react-query";
import { getChat } from "@/widgets/chat/lib/chat.ts";
import { chatKeys } from "@/widgets/chat/lib/queryKeys.ts";

export function useChat() {
    const chatQuery = useQuery({
        queryFn: () => getChat(),
        queryKey: chatKeys.chat(),
    });

    return {
        chat: chatQuery.data,
        isLoading: chatQuery.isLoading,
        isError: chatQuery.isError,
        error: chatQuery.error,
        refetch: chatQuery.refetch,
    };
}
