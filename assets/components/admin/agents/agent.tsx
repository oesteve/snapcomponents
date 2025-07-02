import {
    Settings,

} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link, useParams} from "react-router"
import {useAgent} from "@/components/admin/agents/use-agent.tsx";
import { AgentSettings } from "./agent-settings";

export function AgentConfig() {

    const { agentId } = useParams<{agentId: string}>()
    const { data: agent } = useAgent(parseInt(agentId!))

    if (!agent) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center my-12">
            <div
                className="w-full max-w-6xl flex flex-row gap-4 border border-border rounded-lg overflow-hidden">
                <div className="bg-sidebar pt-12">
                    <Sidebar collapsible="none">
                        <SidebarContent className="h-full">
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem className="h-full">
                                            <SidebarMenuButton
                                                asChild
                                                isActive
                                            >
                                                <Link to={`/admin/agents/${agentId}/settings`}>
                                                    <Settings />
                                                    <span>Settings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                </div>
                <main className="flex flex-1 flex-col overflow-hidden min-h-[600px] p-8">

                        <AgentSettings agent={agent} />
                </main>
            </div>
        </div>
    )
}
