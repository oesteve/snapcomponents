import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useAgents } from "@/admin/modules/agents/agent-list.tsx";
import { useRouteContext } from "@tanstack/react-router";

export function AgentSwitcher() {
    const agent = useRouteContext({
        from: "/admin",
        select: (context) => context.agent,
    });

    console.log("Agent", agent);

    const agentList = useAgents();

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
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            <div className="flex flex-col gap-1 leading-none">
                                <span className="font-medium">Agent</span>
                                <span className="text-xs">{agent.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width)"
                        align="start"
                    >
                        {agentList.data.map((item) => (
                            <DropdownMenuItem key={item.id}>
                                {item.name}
                                {item.id === agent.id && (
                                    <Check className="ml-auto" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
