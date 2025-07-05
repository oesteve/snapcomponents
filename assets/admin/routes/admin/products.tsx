import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/admin/components/articles/article-list.tsx";
import { ProductsList } from "@/admin/catalog/components/products-list.tsx";

export const Route = createFileRoute("/admin/products")({
    component: About,
});

function About() {
    return <ProductsList />;
}
