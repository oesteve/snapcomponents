import {type Agent, getChatConfig} from "@/lib/agents/agents.ts";
import {useQuery} from "@tanstack/react-query";


export function useChatConfiguration(agentId: Agent['id']) {
    return useQuery({
        queryFn: () => getChatConfig(agentId),
        queryKey: ['chat-configuration', agentId],
    })
}
