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

export function getChat() {
    return client.get<Chat>("/api/chat");
}

export function sendMessage(request: { content: string }) {
    return client.post<Chat>(`/api/chat/messages`, {
        content: request.content,
    });
}
