import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Trash2 } from "lucide-react";
import { Form } from "@/components/form";
import Submit from "@/components/form/submit.tsx";
import { useMutation } from "@tanstack/react-query";
import { type Article, removeArticle } from "@/admin/articles/lib/articles.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useState } from "react";
import { toast } from "sonner";

interface RemoveArticleDialogProps {
    article: Article;
    onRemoved: () => void;
}

export function RemoveArticleDialog({
    article,
    onRemoved,
}: RemoveArticleDialogProps) {
    const [open, setOpen] = useState(false);

    const removeArticleMutation = useMutation({
        mutationFn: () => removeArticle(article.id),
        onSuccess: () => {
            setOpen(false);
            onRemoved();
            toast.warning("Article removed successfully.");
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Remove Article</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove the article &quot;
                        {article.title}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    className="grid gap-4"
                    onSubmit={removeArticleMutation.mutateAsync}
                >
                    <FormError />
                    <DevFormData />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Submit variant="destructive">Remove Article</Submit>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
