import client from "@/lib/client.ts";
import type { Agent } from "@/lib/agents/agents.ts";

export type Product = {
    id: number;
    name: string;
    title: string;
    description: string;
    image: string;
    price: number;
};

export function getProducts({ agentId }: { agentId: Agent["id"] }) {
    return client.get<Product[]>(`/api/agents/${agentId}/products`);
}

export function searchProducts({
    agentId,
    query,
}: {
    agentId: Agent["id"];
    query: string | undefined;
}) {
    return client.post<Product[]>(`/api/agents/${agentId}/products/search`, {
        query,
    });
}

export type ProductData = {
    name: string;
    title: string;
    description: string;
    image: string;
    price: number;
};

export function createProduct(product: ProductData) {
    return client.post<Product>("/api/products", product);
}

export function removeProduct(id: Product["id"]) {
    return client.delete<Product>(`/api/products/${id}`);
}

export function updateProduct({
    id,
    name,
    title,
    description,
    image,
    price,
}: {
    id: Product["id"];
    name: Product["name"];
    title: Product["title"];
    description: Product["description"];
    image: Product["image"];
    price: Product["price"];
}) {
    return client.put<Product>(`/api/products/${id}`, {
        name,
        title,
        description,
        image,
        price,
    });
}

export type Provider = {
    name: string;
    settings: Record<string, unknown>;
};

export function getProvider(agentId: Agent["id"]) {
    return client.get<Provider>(`/api/agents/${agentId}/products/provider`);
}

export function getProviders(agentId: Agent["id"]) {
    return client.get<{ name: string }[]>(
        `/api/agents/${agentId}/products/providers`,
    );
}

export function setProvider(provider: {
    agentId: Agent["id"];
    name: string;
    settings: Record<string, unknown>;
}) {
    return client.put<Provider>(
        `/api/agents/${provider.agentId}/products/provider`,
        provider,
    );
}
