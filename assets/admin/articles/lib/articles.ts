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

// This is the actual response from the server
export type ImportApiResponse = {
    total_queued: number;
    errors: Array<{ line: number; message: string }>;
    message: string;
};

export async function importArticlesFromCsv(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.postFormData<ImportApiResponse>(
        "/api/articles/import/csv",
        formData,
    );

    // Transform the API response to match the expected ImportResult format
    return {
        // Since articles are now queued for import and not immediately available,
        // we return an empty array as there are no articles to display yet
        articles: [],
        // Use total_queued as the success count
        success: response.total_queued,
        // Pass through the errors
        errors: response.errors || [],
    };
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
