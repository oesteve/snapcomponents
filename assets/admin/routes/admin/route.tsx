import { AppSidebar } from "@/admin/modules/layout/components/app-sidebar.tsx";

import { Separator } from "@/components/ui/separator.tsx";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Breadcrumbs } from "@/admin/modules/layout/components/breadcrumbs.tsx";

export const Route = createFileRoute("/admin")({
    beforeLoad: () => ({
        title: "Admin",
    }),
    component: Layout,
});

function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumbs />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-8 items-center">
                    <Outlet />
                </div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
