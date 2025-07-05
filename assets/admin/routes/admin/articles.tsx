import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/admin/articles/components/article-list.tsx";

export const Route = createFileRoute("/admin/articles")({
    component: About,
});

function About() {
    return <ArticleList />;
}
