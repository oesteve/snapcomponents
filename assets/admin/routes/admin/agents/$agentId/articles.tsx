import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/admin/modules/articles/components/article-list.tsx";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";

export const Route = createFileRoute("/admin/agents/$agentId/articles")({
    beforeLoad: () => ({
        title: "Articles",
    }),
    component: About,
});

function About() {
    const agent = useCurrentAgent();
    return <ArticleList agent={agent} />;
}
