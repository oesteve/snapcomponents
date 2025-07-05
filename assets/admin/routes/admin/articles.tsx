import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/admin/components/articles/article-list.tsx";

export const Route = createFileRoute("/admin/articles")({
    component: About,
});

function About() {
    return <ArticleList />;
}
