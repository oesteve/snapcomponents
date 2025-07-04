import {useBreadcrumb} from "@/hooks/use-breadcrumb.ts";
import {useLoaderData} from "react-router";
import {AgentSettings} from "@/components/admin/agents/agent-settings.tsx";
import {type Agent} from "@/lib/agents/agents.ts";

export function AgentConfigPage() {
    const agent = useLoaderData() as Agent;

    // Set breadcrumbs for this page
    useBreadcrumb([
        {label: "Admin", href: "/admin"},
        {label: "Agents", href: "/admin/agents"},
        {label: agent.name, isActive: true}
    ]);

    return (
        <AgentSettings agent={agent}/>
    )
}
