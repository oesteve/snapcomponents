"use client";

import {
    BotMessageSquare,
    ChevronRight,
    Code,
    FileText,
    type LucideIcon,
    Settings,
    ShoppingBasket,
    SquareTerminal,
} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { AgentSwitcher } from "@/admin/components/layout/agent-switcher.tsx";
import { useLayoutAgent } from "@/admin/components/layout/breadcrumb-store.ts";

const agentSettingsData: {
    title: string;
    url: string;
    icon: LucideIcon;
}[] = [
    {
        title: "Settings",
        url: "/admin/agents/$agentId/settings",
        icon: Settings,
    },
    {
        title: "Installation",
        url: "/admin/agents/$agentId/install",
        icon: Code,
    },
    {
        title: "Chat",
        url: "/admin/agents/$agentId/chat",
        icon: BotMessageSquare,
    },
];

const navMainData: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
}[] = [
    {
        title: "Agents",
        url: "/admin/agents",
        icon: SquareTerminal,
    },
    {
        title: "Articles",
        url: "/admin/articles",
        icon: FileText,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBasket,
    },
];

export function NavMain() {
    const { agent } = useLayoutAgent();

    return (
        <>
            {agent ? (
                <SidebarGroup className="mb-8">
                    <SidebarMenu>
                        <SidebarHeader className="mb-12">
                            <AgentSwitcher />
                        </SidebarHeader>
                        <SidebarGroupLabel>Agent</SidebarGroupLabel>
                        {agentSettingsData.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                                <Link
                                    to={item.url}
                                    params={{ agentId: agent.id.toString() }}
                                >
                                    {({ isActive }) => (
                                        <SidebarMenuButton
                                            className={cn(
                                                isActive && "bg-secondary",
                                            )}
                                        >
                                            <item.icon />
                                            {item.title}
                                        </SidebarMenuButton>
                                    )}
                                </Link>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ) : null}
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarGroupLabel>Global Settings</SidebarGroupLabel>
                    {navMainData.map((item) => (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    {item.items && item.items.length > 0 ? (
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    ) : (
                                        <Link to={item.url}>
                                            {({ isActive }) => (
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                    className={cn(
                                                        isActive &&
                                                            "bg-secondary",
                                                    )}
                                                >
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            )}
                                        </Link>
                                    )}
                                </CollapsibleTrigger>

                                {item.items && item.items.length > 0 && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <Link to={subItem.url}>
                                                        {({ isActive }) => (
                                                            <SidebarMenuSubButton
                                                                className={cn(
                                                                    isActive &&
                                                                        "bg-secondary",
                                                                )}
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                    ***
                                                                </span>
                                                            </SidebarMenuSubButton>
                                                        )}
                                                    </Link>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
