import type { Agent } from "@/lib/agents/agents.ts";

export function agentKey(agentId: Agent["id"]) {
    return [`agent-${agentId}`];
}
