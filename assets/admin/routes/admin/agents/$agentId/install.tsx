import { AgentInstall } from "@/admin/components/agents/agent-install.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useLayoutStore } from "@/admin/components/layout/breadcrumb-store.ts";
import { getAgent } from "@/lib/agents/agents.ts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";

export const Route = createFileRoute("/admin/agents/$agentId/install")({
    component: Install,
    loader: async ({ params: { agentId } }) => {
        const agent = await getAgent(parseInt(agentId));

        const layout = useLayoutStore.getState();

        layout.setBreadcrumbs([
            { label: "Admin", href: "/admin" },
            { label: "Agents", href: "/admin/agents" },
            { label: agent.name },
            { label: "Install", isActive: true },
        ]);

        layout.setAgent(agent);

        return {
            agent,
        };
    },
});

export function Install() {
    const { agent } = Route.useLoaderData();

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Install Agent</CardTitle>
                <CardDescription>
                    Instructions to install the agent on your website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AgentInstall agent={agent} />
            </CardContent>
        </Card>
    );
}
