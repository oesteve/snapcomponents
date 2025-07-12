import { createFileRoute } from "@tanstack/react-router";
import { ProductsList } from "@/admin/modules/catalog/components/products-list.tsx";

export const Route = createFileRoute("/admin/agents/$agentId/products")({
    beforeLoad: () => ({
        title: "Products",
    }),
    component: Products,
});

function Products() {
    return <ProductsList />;
}
