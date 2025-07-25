import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
    type Article,
    getArticles,
} from "@/admin/modules/articles/lib/articles.ts";
import { DataTable } from "@/admin/modules/agents/data-table.tsx";
import { CreateArticleDialog } from "@/admin/modules/articles/components/create-article-dialog.tsx";
import { RemoveArticleDialog } from "@/admin/modules/articles/components/remove-article-dialog.tsx";
import { EditArticleDialog } from "@/admin/modules/articles/components/edit-article-dialog.tsx";
import { ImportArticlesDialog } from "@/admin/modules/articles/components/import-articles-dialog.tsx";
import type { Agent } from "@/lib/agents/agents.ts";
import { articlesKey } from "@/admin/modules/articles/hooks/query-keys.ts";
import { SearchArticles } from "@/admin/modules/articles/components/search-articles.tsx";
import { useEffect, useState } from "react";

interface ArticleListProps {
    agent: Agent;
}

export function ArticleList({ agent }: ArticleListProps) {
    const [articles, setArticles] = useState<Article[]>([]);

    const articlesQuery = useQuery({
        queryKey: articlesKey(agent),
        queryFn: () => getArticles({ agentId: agent.id }),
    });

    useEffect(() => {
        setArticles(articlesQuery.data ?? []);
    }, [articlesQuery.data]);

    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <EditArticleDialog
                        article={article}
                        onEdited={refresh}
                        agentId={agent.id}
                        trigger={
                            <span className="font-medium hover:underline cursor-pointer">
                                {article.title}
                            </span>
                        }
                    />
                );
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <span className="font-medium hover:underline cursor-pointer">
                        {article.category.name}
                    </span>
                );
            },
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <div className="flex justify-end space-x-2">
                        <EditArticleDialog
                            article={article}
                            onEdited={refresh}
                            agentId={agent.id}
                        />
                        <RemoveArticleDialog
                            article={article}
                            onRemoved={refresh}
                            agentId={agent.id}
                        />
                    </div>
                );
            },
        },
    ];

    function refresh() {
        articlesQuery.refetch();
    }

    function handleSearchReset() {
        setArticles(articlesQuery.data ?? []);
    }

    function handleSearchResults(articles: Article[]) {
        setArticles(articles);
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-4">
            <div className="flex flex-row justify-end space-x-2">
                <SearchArticles
                    onResults={handleSearchResults}
                    onReset={handleSearchReset}
                />
                <ImportArticlesDialog onImported={refresh} agentId={agent.id} />
                <CreateArticleDialog onCreated={refresh} agentId={agent.id} />
            </div>
            <DataTable columns={columns} data={articles} />
        </div>
    );
}
