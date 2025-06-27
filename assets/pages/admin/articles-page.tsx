import { ArticleList } from "@/components/admin/articles/article-list.tsx";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";

export function ArticlesPage() {
    // Set breadcrumbs for this page
    useBreadcrumb([
        { label: "Admin", href: "/admin" },
        { label: "Articles", isActive: true }
    ]);

    return (
        <div className="w-6xl mx-auto">
            <ArticleList />
        </div>
    )
}
