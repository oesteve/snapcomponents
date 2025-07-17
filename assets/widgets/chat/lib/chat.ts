import client from "@/lib/client.ts";

export type CreateChatRequest = {
    content: string;
};

export type Chat = {
    id: number;
    configuration: {
        name: string;
    };
    messages: {
        id: number;
        role: "user" | "assistant";
        content: string;
    }[];
};

export function createChat(request: CreateChatRequest) {
    return client.post<Chat>("/api/chats", request);
}

export function sendMessage(request: { chatId: number; content: string }) {
    return client.post<Chat>(`/api/chats/${request.chatId}/messages`, {
        content: request.content,
    });
}
