import { type Agent } from "@/lib/agents/agents.ts";
import { useQuery } from "@tanstack/react-query";
import { getChatConfig } from "@/admin/modules/chat/lib/chat";

export function useChatConfiguration(agentId: Agent["id"]) {
    return useQuery({
        queryFn: () => getChatConfig(agentId),
        queryKey: ["chat-configuration", agentId],
    });
}
