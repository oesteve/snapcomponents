import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/agents/$agentId/products")({
    beforeLoad: () => ({
        title: "Products",
    }),
    component: Outlet,
});
