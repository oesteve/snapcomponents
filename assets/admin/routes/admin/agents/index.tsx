import {AgentList} from "@/admin/components/agents/agent-list.tsx";
import { useBreadcrumb } from "@/admin/components/layout/use-breadcrumb.ts";
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute('/admin/agents/')({
    component: AgentsPage,
})

function AgentsPage() {
    // Set breadcrumbs for this page
    useBreadcrumb([
        { label: "Admin", href: "/admin" },
        { label: "Agents", isActive: true }
    ]);

    return (
        <div className="w-6xl mx-auto">
            <AgentList />
        </div>
    )
}
