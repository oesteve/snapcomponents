"use client"

import {ChevronRight, type LucideIcon} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {NavLink} from "react-router";
import {cn} from "@/lib/utils";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
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
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                ) : (

                                    <NavLink to={item.url}>
                                        {({isActive}) => (
                                            <SidebarMenuButton tooltip={item.title}
                                                               className={cn(isActive && 'bg-secondary')}
                                            >
                                                {item.icon && <item.icon/>}
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        )}
                                    </NavLink>
                                )}
                            </CollapsibleTrigger>
                            {item.items && item.items.length > 0 && (
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <NavLink to={subItem.url}>
                                                    {({isActive}) => (
                                                        <SidebarMenuSubButton
                                                            className={cn(isActive && 'bg-secondary')}
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </SidebarMenuSubButton>
                                                    )}
                                                </NavLink>
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
    )
}
