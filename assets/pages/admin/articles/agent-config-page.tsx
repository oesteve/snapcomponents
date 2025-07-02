
import { useBreadcrumb } from "@/hooks/use-breadcrumb.ts";
import {AgentConfig} from "@/components/admin/agents/agent.tsx";
import {useAgent} from "@/components/admin/agents/use-agent.tsx";
import {useParams} from "react-router";

export function AgentConfigPage() {
    const { agentId } = useParams<{agentId: string}>()
    const {data: agent} = useAgent(parseInt(agentId!))

    // Set breadcrumbs for this page
    useBreadcrumb([
        { label: "Admin", href: "/admin" },
        { label: "Agents", href: "/admin/agents" },
        { label: agent?.name ?? '', isActive: true }
    ]);

    return (
        <div className="w-6xl mx-auto">
            <AgentConfig />
        </div>
    )
}
