import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewChat, type Chat } from "@/widgets/chat/lib/chat.ts";
import { chatKeys } from "@/widgets/chat/lib/queryKeys.ts";

export function useNewChat() {
    const queryClient = useQueryClient();

    const newChatMutation = useMutation({
        mutationFn: createNewChat,
        onSuccess: (data: Chat) => {
            // Update the cache with the new chat data
            queryClient.setQueryData(chatKeys.chat(), data);
            // Invalidate the chat query to refetch if needed
            queryClient.invalidateQueries({ queryKey: chatKeys.chat() });
        },
        onMutate: () => {
            const chat = queryClient.getQueryData<Chat>(chatKeys.chat());

            // Replace the chat query data with the result from the mutation
            if (chat) {
                queryClient.setQueryData<Chat>(chatKeys.chat(), {
                    ...chat,
                    messages: [],
                });
            }
        },
    });

    return {
        createChat: newChatMutation.mutate,
        isLoading: newChatMutation.isPending,
        isError: newChatMutation.isError,
        error: newChatMutation.error,
        newChat: newChatMutation.data,
    };
}
