import { AgentList } from "@/admin/modules/agents/agent-list.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/agents/")({
    beforeLoad: ({ context }) => ({
        ...context,
        title: "Agents",
    }),
    component: AgentsPage,
});

function AgentsPage() {
    return (
        <div className="w-6xl mx-auto">
            <AgentList />
        </div>
    );
}
