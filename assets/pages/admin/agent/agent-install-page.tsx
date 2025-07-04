import {useBreadcrumb} from "@/hooks/use-breadcrumb.ts";
import {useLoaderData} from "react-router";
import {AgentInstall} from "@/components/admin/agents/agent-install.tsx";
import {type Agent} from "@/lib/agents/agents.ts";

export function AgentInstallPage() {
    const agent = useLoaderData() as Agent;

    // Set breadcrumbs for this page
    useBreadcrumb([
        {label: "Admin", href: "/admin"},
        {label: "Agents", href: "/admin/agents"},
        {label: agent.name, href: `/admin/agents/${agent.id}/settings`},
        {label: "Install", isActive: true}
    ]);

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-medium">Installation</h1>
                    <p className="text-sm text-muted-foreground">
                        Install the agent on your app.
                    </p>
                </div>
            </div>
            <AgentInstall agent={agent}/>
        </div>
    )
}
