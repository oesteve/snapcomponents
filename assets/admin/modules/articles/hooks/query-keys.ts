import type { Agent } from "@/lib/agents/agents.ts";

export function articlesKey(agent: Agent) {
    return [`agent-${agent.id}`, "articles"];
}
