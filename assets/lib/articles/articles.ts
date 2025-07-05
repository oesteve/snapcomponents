import client from "@/lib/client.ts";

export type Article = {
    id: number;
    name: string;
    title: string;
    description: string;
    content: string;
};

export function getArticles() {
    return client.get<Article[]>("/api/articles");
}

export type ArticleData = {
    name: string;
    title: string;
    description: string;
    content: string;
};

export function createArticle(article: ArticleData) {
    return client.post<Article>("/api/articles", article);
}

export function removeArticle(id: Article["id"]) {
    return client.delete<Article>(`/api/articles/${id}`);
}

export function updateArticle({
    id,
    name,
    title,
    description,
    content,
}: {
    id: Article["id"];
    name: Article["name"];
    title: Article["title"];
    description: Article["description"];
    content: Article["content"];
}) {
    return client.put<Article>(`/api/articles/${id}`, {
        name,
        title,
        description,
        content,
    });
}
