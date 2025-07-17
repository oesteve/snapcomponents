import { type Agent, getAgents } from "@/lib/agents/agents";
import { queryClient } from "@/lib/react-query/client";
import { QueryClient } from "@tanstack/react-query";

export interface AdminContext {
    agent: Agent;
    queryClient: QueryClient;
    title?: string;
}
export async function getInitialContext() {
    const agents = await queryClient.ensureQueryData({
        queryKey: ["agents"],
        queryFn: getAgents,
    });

    return {
        agent: agents[0],
        queryClient,
        title: undefined,
    };
}
