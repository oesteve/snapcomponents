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

/**
 * Fetches all products from the catalog
 * @returns Promise with the list of products
 */
export function getProducts({ agentId }: { agentId: Agent["id"] }) {
    return client.get<Product[]>(`/api/agents/${agentId}/products`);
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
