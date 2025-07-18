import { type Agent, getAgents } from "@/lib/agents/agents.ts";
import { useQuery } from "@tanstack/react-query";

export function agentKey(agentId: Agent["id"]) {
    return [`agent-${agentId}`];
}

export function availableAgents() {
    return useQuery({
        queryKey: ["agents"],
        queryFn: getAgents,
    });
}
