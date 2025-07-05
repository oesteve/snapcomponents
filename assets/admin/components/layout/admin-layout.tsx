import React from "react";
import { AppSidebar } from "@/admin/components/layout/app-sidebar.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { useBreadcrumbItems } from "@/admin/components/layout/use-breadcrumb.ts";
import { Link, Outlet } from "@tanstack/react-router";

export default function AminLayout() {
    const breadcrumbItems = useBreadcrumbItems();

    // If no breadcrumbs are set, show a default one
    const displayedBreadcrumbs =
        breadcrumbItems.length > 0
            ? breadcrumbItems
            : [{ label: "Admin", isActive: true }];

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {displayedBreadcrumbs.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <BreadcrumbSeparator />}
                                        <BreadcrumbItem
                                            className={
                                                index === 0
                                                    ? "hidden md:block"
                                                    : ""
                                            }
                                        >
                                            {item.isActive ? (
                                                <BreadcrumbPage>
                                                    {item.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={item.href || "#"}>
                                                        {item.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
