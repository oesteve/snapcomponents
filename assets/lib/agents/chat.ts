import client from "@/lib/client.ts";
import type {Agent} from "@/lib/agents/agents.ts";
import { useQuery } from "@tanstack/react-query";


export type ChatIntent = {
    id: number;
    name: string;
    description: string;
    instructions: string;
    tools: string[]
    widgets: string[]
};

export type ChatConfig = {
    instructions: string;
    intents: ChatIntent[]
}

export type ChatTool = {
    name: string;
    description: string;
    parameters: Record<string, any>;
}

export type ChatComponent = {
    name: string;
    description: string;
}

export function getChatConfig(id: Agent["id"]) {
    return client.get<ChatConfig>(`/api/agents/${id}/chat`);
}

export function updateChatConfig(chatConfig: { agentId: Agent["id"] } & ChatConfig) {
    return client.put<ChatConfig>(`/api/agents/${chatConfig.agentId}/chat`, chatConfig);
}

export function getTools() {
    return client.get<ChatTool[]>('/api/chats/tools');
}

export function getComponents() {
    return client.get<Record<string, ChatComponent>>('/api/chats/components');
}

/**
 * React Query hook for fetching available chat tools
 */
export function useQueryTools() {
    return useQuery({
        queryKey: ['chat-tools'],
        queryFn: () => getTools(),
    });
}

/**
 * React Query hook for fetching available chat components
 */
export function useQueryComponents() {
    return useQuery({
        queryKey: ['chat-components'],
        queryFn: () => getComponents(),
    });
}
