import { useRouterState } from "@tanstack/react-router";
import type { Agent } from "@/lib/agents/agents.ts";

const routeId = "/admin/agents/$agentId";
export function useCurrentAgent(): Agent {
    const selected = useRouterState({
        select: (state) => state.matches,
    }).find((match) => match.routeId === routeId);

    if (!selected) {
        throw new Error("No agent selected");
    }

    return selected.context.agent;
}

export function useSelectedAgent(): Agent | null {
    const selected = useRouterState({
        select: (state) => state.matches,
    }).find((match) => match.routeId === routeId);

    if (!selected) {
        return null;
    }

    return selected.context.agent;
}
