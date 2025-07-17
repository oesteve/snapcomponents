import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getAgent } from "@/lib/agents/agents.ts";
import { agentKey } from "@/admin/modules/agents/hooks/agent-query-key.ts";

export const Route = createFileRoute("/admin/agents/$agentId")({
    beforeLoad: async ({ params, context }) => {
        const agentId = parseInt(params.agentId);
        const agent = await context.queryClient.ensureQueryData({
            queryFn: () => getAgent(agentId),
            queryKey: agentKey(agentId),
        });

        return {
            agent,
            title: `${agent.name}`,
        };
    },
    component: Outlet,
});
