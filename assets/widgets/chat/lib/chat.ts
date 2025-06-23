import client from "@/widgets/chat/lib/client.ts";

export type CreateChatRequest = {
    content: string;
}

export type Chat = {
    id: number;
    messages: {
        id: number;
        content: string;
    }[]
}

export function createChat(request: CreateChatRequest) {
    return client.post<CreateChatRequest, Chat>('/api/chats', request);
}

export function sendMessage(request: {
    chatId: number;
    content: string;
}) {
    return client.post<CreateChatRequest, Chat>(`/api/chats/${request.chatId}/messages`, {
        content: request.content,
    });
}
