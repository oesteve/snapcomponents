import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Plus } from "lucide-react";
import { Form } from "@/components/form";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/admin/catalog/lib/products.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useState } from "react";
import { toast } from "sonner";
import NumberInputWidget from "@/components/form/widgets/number-input-widget.tsx";

interface CreateProductDialogProps {
    onCreated: () => void;
}

export function CreateProductDialog({ onCreated }: CreateProductDialogProps) {
    const [open, setOpen] = useState(false);

    const createProductMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            setOpen(false);
            onCreated();
            toast.success("Product created successfully");
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Create Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Product</DialogTitle>
                    <DialogDescription>
                        Create a new Product to be used in your catalog.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    className="grid gap-4"
                    onSubmit={createProductMutation.mutateAsync}
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

                    <Submit>Create Product</Submit>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
