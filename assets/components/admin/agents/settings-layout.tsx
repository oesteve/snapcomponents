import {
    Code,
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
import {Link, Outlet, useParams} from "react-router"


export function AgentLayout() {

    const {agentId} = useParams<{ agentId: string }>()

    return (
        <div>
            <div className="flex flex-col justify-center items-center my-12">
                <div
                    className="w-full max-w-6xl flex flex-row gap-4 border border-border rounded-lg overflow-hidden">
                    <div className="bg-sidebar pt-12">
                        <Sidebar collapsible="none">
                            <SidebarContent className="h-full">
                                <SidebarGroup>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive
                                                >
                                                    <Link to={`/admin/agents/${agentId}/settings/general`}>
                                                        <Settings/>
                                                        <span>General Settings</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <Link to={`/admin/agents/${agentId}/settings/install`}>
                                                        <Code/>
                                                        <span>Install</span>
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
                        <Outlet/>
                    </main>
                </div>
            </div>
        </div>
    )
}
