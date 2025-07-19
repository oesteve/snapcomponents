import client from "@/lib/client.ts";
import type { Agent } from "@/lib/agents/agents.ts";
import { useQuery } from "@tanstack/react-query";

export type ChatIntent = {
    id: number;
    name: string;
    description: string;
    instructions: string;
    tools: string[];
    widgets: string[];
};

export type ChatConfig = {
    instructions: string;
    intents: ChatIntent[];
};

export type ChatTool = {
    name: string;
    description: string;
    parameters: Record<string, any>;
};

export type ChatComponent = {
    name: string;
    description: string;
};

export function getChatConfig(id: Agent["id"]) {
    return client.get<ChatConfig | null>(`/api/agents/${id}/chats/settings`);
}

export function setChatSettings(
    chatConfig: { agentId: Agent["id"] } & ChatConfig,
) {
    return client.put<ChatConfig>(
        `/api/agents/${chatConfig.agentId}/chats/settings`,
        chatConfig,
    );
}

export function getTools({ agentId }: { agentId: Agent["id"] }) {
    return client.get<ChatTool[]>(
        `/api/agents/${agentId}/chats/settings/tools`,
    );
}

export function getComponents({ agentId }: { agentId: Agent["id"] }) {
    return client.get<Record<string, ChatComponent>>(
        `/api/agents/${agentId}/chats/settings/components`,
    );
}

/**
 * React Query hook for fetching available chat tools
 */
export function useQueryTools(agentId: Agent["id"]) {
    return useQuery({
        queryKey: ["chat-tools"],
        queryFn: () => getTools({ agentId }),
    });
}

/**
 * React Query hook for fetching available chat components
 */
export function useQueryComponents(agentId: Agent["id"]) {
    return useQuery({
        queryKey: ["chat-components"],
        queryFn: () => getComponents({ agentId }),
    });
}

/**
 * Create a new intent for a chat configuration
 */
export function createIntent(intent: {
    agentId: Agent["id"];
    name: string;
    description: string;
    instructions: string;
    tools: string[];
    widgets: string[];
    configurationId: number;
}) {
    return client.post<ChatIntent>(
        `/api/agents/${intent.agentId}/chats/settings/intents`,
        intent,
    );
}

/**
 * Update an existing intent
 */
export function updateIntent(intent: {
    agentId: Agent["id"];
    id: ChatIntent["id"];
    name: string;
    description: string;
    instructions: string;
    tools: string[];
    widgets: string[];
}) {
    return client.put<ChatIntent>(
        `/api/agents/${intent.agentId}/chats/settings/intents/${intent.id}`,
        intent,
    );
}

export function removeIntent({
    agentId,
    id,
}: {
    agentId: Agent["id"];
    id: ChatIntent["id"];
}) {
    return client.delete<ChatIntent>(
        `/api/agents/${agentId}/chats/settings/intents/${id}`,
    );
}
