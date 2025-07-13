import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
    type Product,
    getProducts,
} from "@/admin/modules/catalog/lib/products.ts";
import { DataTable } from "@/admin/modules/agents/data-table.tsx";
import { CreateProductDialog } from "@/admin/modules/catalog/components/create-product-dialog.tsx";
import { RemoveProductDialog } from "@/admin/modules/catalog/components/remove-product-dialog.tsx";
import { EditProductDialog } from "@/admin/modules/catalog/components/edit-product-dialog.tsx";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { Settings } from "lucide-react";

export function ProductsList() {
    const agent = useCurrentAgent();

    const productsList = useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts({ agentId: agent.id }),
    });

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="w-12 h-12 relative">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover w-full h-full rounded border"
                            />
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <EditProductDialog
                        product={product}
                        onEdited={refresh}
                        trigger={
                            <span className="font-medium hover:underline cursor-pointer">
                                {product.name}
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
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div
                        className="max-w-md truncate"
                        title={product.description}
                    >
                        {product.description}
                    </div>
                );
            },
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const product = row.original;
                return <span>${product.price.toFixed(2)}</span>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex justify-end space-x-2">
                        <EditProductDialog
                            product={product}
                            onEdited={refresh}
                        />
                        <RemoveProductDialog
                            product={product}
                            onRemoved={refresh}
                        />
                    </div>
                );
            },
        },
    ];

    function refresh() {
        productsList.refetch();
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-4">
            <div className="flex flex-row justify-end gap-2">
                <Link
                    to="/admin/agents/$agentId/products/provider"
                    params={{ agentId: agent.id.toString() }}
                >
                    <Button variant="outline">
                        <Settings />
                        Settings
                    </Button>
                </Link>

                <CreateProductDialog onCreated={refresh} />
            </div>
            <DataTable columns={columns} data={productsList.data ?? []} />
        </div>
    );
}
