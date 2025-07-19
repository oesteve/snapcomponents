import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, type Chat } from "@/widgets/chat/lib/chat.ts";
import { chatKeys } from "@/widgets/chat/lib/queryKeys.ts";

export function useSendMessage() {
    const queryClient = useQueryClient();

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onMutate: async (newMessage) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: chatKeys.chat() });

            // Snapshot the previous value
            const previousChat = queryClient.getQueryData<Chat>(
                chatKeys.chat(),
            );

            // Optimistically update to the new value
            if (previousChat) {
                queryClient.setQueryData<Chat>(chatKeys.chat(), {
                    ...previousChat,
                    messages: [
                        ...previousChat.messages,
                        {
                            id: Date.now(), // Temporary ID
                            role: "user",
                            content: newMessage.content,
                        },
                    ],
                });
            }

            return { previousChat };
        },
        onError: (_err, _newMessage, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousChat) {
                queryClient.setQueryData<Chat>(
                    chatKeys.chat(),
                    context.previousChat,
                );
            }
        },
        onSettled: (chat) => {
            // Replace the chat query data with the result from the mutation
            if (chat) {
                queryClient.setQueryData<Chat>(chatKeys.chat(), chat);
            }
        },
    });

    return {
        sendMessage: sendMessageMutation.mutate,
        isLoading: sendMessageMutation.isPending,
        isError: sendMessageMutation.isError,
        error: sendMessageMutation.error,
    };
}
