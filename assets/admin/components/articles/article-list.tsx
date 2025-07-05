import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { type Article, getArticles } from "@/lib/articles/articles.ts";
import { DataTable } from "@/admin/components/agents/data-table.tsx";
import { CreateArticleDialog } from "@/admin/components/articles/create-article-dialog.tsx";
import { RemoveArticleDialog } from "@/admin/components/articles/remove-article-dialog.tsx";
import { EditArticleDialog } from "@/admin/components/articles/edit-article-dialog.tsx";

export function ArticleList() {
    const articlesQuery = useQuery({
        queryKey: ['articles'],
        queryFn: getArticles
    });

    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <EditArticleDialog
                        article={article}
                        onEdited={refresh}
                        trigger={
                            <span className="font-medium hover:underline cursor-pointer">
                                {article.name}
                            </span>
                        }
                    />
                );
            },
        },
        {
            accessorKey: "title",
            header: "Title",
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
                        <EditArticleDialog article={article} onEdited={refresh} />
                        <RemoveArticleDialog article={article} onRemoved={refresh} />
                    </div>
                );
            },
        }
    ];

    function refresh() {
        articlesQuery.refetch();
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-4">
            <div className="flex flex-row justify-end">
                <CreateArticleDialog onCreated={refresh} />
            </div>
            <DataTable columns={columns} data={articlesQuery.data ?? []} />
        </div>
    );
}
