import { AgentInstall } from "@/admin/modules/agents/agent-install.tsx";
import { createFileRoute } from "@tanstack/react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";

export const Route = createFileRoute("/admin/agents/$agentId/install")({
    beforeLoad: () => ({
        title: "Install",
    }),
    component: Install,
});

export function Install() {
    const agent = useCurrentAgent();

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
