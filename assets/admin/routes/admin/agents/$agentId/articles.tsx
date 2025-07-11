import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/admin/articles/components/article-list.tsx";
import { getAgent } from "@/lib/agents/agents.ts";

export const Route = createFileRoute("/admin/agents/$agentId/articles")({
    component: About,
    loader: async ({ params: { agentId } }) => {
        const agent = await getAgent(parseInt(agentId));

        return {
            agent,
        };
    },
});

function About() {
    const { agent } = Route.useLoaderData();

    return <ArticleList agent={agent} />;
}
