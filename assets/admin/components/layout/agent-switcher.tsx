import {Check, ChevronsUpDown, GalleryVerticalEnd} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useLayoutAgent} from "@/admin/components/layout/breadcrumb-store.ts";
import {useAgents} from "@/admin/components/agents/agent-list.tsx";

export function AgentSwitcher() {

    const agentList = useAgents()
    const {agent} = useLayoutAgent()

    if (!agentList.data || !agent) {
        return null;
    }


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <GalleryVerticalEnd className="size-4"/>
                            </div>
                            <div className="flex flex-col gap-1 leading-none">
                                <span className="font-medium">Agent</span>
                                <span className="text-xs">{agent.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width)"
                        align="start"
                    >
                        {agentList.data.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                            >
                                {item.name}
                                {item.id === agent.id && <Check className="ml-auto"/>}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
