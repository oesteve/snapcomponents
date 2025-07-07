import client from "@/lib/client.ts";

export type ArticleCategory = {
    id: number;
    name: string;
};

export type Article = {
    id: number;
    title: string;
    description: string;
    content: string;
    category: ArticleCategory;
};

export function getArticles() {
    return client.get<Article[]>("/api/articles");
}

export type ImportResult = {
    articles: Article[];
    success: number;
    errors: Array<{ line: number; message: string }>;
};

export async function importArticlesFromCsv(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    return client.postFormData<ImportResult>(
        "/api/articles/import/csv",
        formData,
    );
}

export type ArticleData = {
    title: string;
    description: string;
    content: string;
    categoryId?: number;
};

export function createArticle(article: ArticleData) {
    return client.post<Article>("/api/articles", article);
}

export function removeArticle(id: Article["id"]) {
    return client.delete<Article>(`/api/articles/${id}`);
}

export function updateArticle({
    id,
    title,
    description,
    content,
    categoryId,
}: {
    id: Article["id"];
    title: Article["title"];
    description: Article["description"];
    content: Article["content"];
    categoryId?: number;
}) {
    return client.put<Article>(`/api/articles/${id}`, {
        title,
        description,
        content,
        categoryId,
    });
}

export function getArticleCategories() {
    return client.get<ArticleCategory[]>("/api/articles/categories");
}
