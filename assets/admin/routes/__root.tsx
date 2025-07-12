import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type Agent, getAgents } from "@/lib/agents/agents.ts";
import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

export interface AdminContext {
    agent: Agent;
    queryClient: QueryClient;
    title?: string;
}

export const Route = createRootRouteWithContext<AdminContext>()({
    beforeLoad: async () => {
        const agents = await queryClient.ensureQueryData({
            queryKey: ["agents"],
            queryFn: getAgents,
        });

        return {
            agent: agents[0],
            queryClient,
        };
    },
    loader: async ({ context }) => {
        return {
            agent: context.agent,
        };
    },
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
});
