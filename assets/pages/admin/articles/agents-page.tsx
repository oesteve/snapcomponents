import {AgentList} from "@/components/admin/agents/agent-list.tsx";
import { useBreadcrumb } from "@/hooks/use-breadcrumb.ts";

export function AgentsPage() {
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
