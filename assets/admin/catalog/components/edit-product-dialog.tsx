import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Edit } from "lucide-react";
import { Form } from "@/components/form";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import { useMutation } from "@tanstack/react-query";
import { type Product, updateProduct } from "@/admin/catalog/lib/products.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import NumberInputWidget from "@/components/form/widgets/number-input-widget.tsx";

interface EditProductDialogProps {
    product: Product;
    onEdited: () => void;
    trigger?: React.ReactNode;
}

export function EditProductDialog({
    product,
    onEdited,
    trigger,
}: EditProductDialogProps) {
    const [open, setOpen] = useState(false);
    const editProductMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            setOpen(false);
            onEdited();
            toast.success("Product updated successfully");
        },
    });

    const defaultData = useMemo(
        () => ({
            id: product.id,
            name: product.name,
            title: product.title,
            description: product.description,
            image: product.image,
            price: product.price,
        }),
        [product],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Edit the product information.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    className="grid gap-4"
                    onSubmit={editProductMutation.mutateAsync}
                    defaultData={defaultData}
                >
                    <FormError />
                    <DevFormData />

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the product"}
                    />

                    <TextInputWidget
                        name={"title"}
                        label={"Title"}
                        description={"Title of the product"}
                    />

                    <TextInputWidget
                        name={"description"}
                        label={"Description"}
                        description={"Brief description of the product"}
                    />

                    <TextInputWidget
                        name={"image"}
                        label={"Image URL"}
                        description={"URL of the product image"}
                    />

                    <NumberInputWidget
                        name={"price"}
                        label={"Price"}
                        description={"Price of the product"}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Submit>Save Changes</Submit>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
