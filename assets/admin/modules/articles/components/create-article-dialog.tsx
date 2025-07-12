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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createArticle,
    getArticleCategories,
} from "@/admin/modules/articles/lib/articles.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TextareaWidget from "@/components/form/widgets/textarea-input-widget.tsx";
import SelectInputWidget from "@/components/form/widgets/select-input-widget.tsx";

interface CreateArticleDialogProps {
    onCreated: () => void;
    agentId: number;
}

export function CreateArticleDialog({
    onCreated,
    agentId,
}: CreateArticleDialogProps) {
    const [open, setOpen] = useState(false);

    const { data: categories = [] } = useQuery({
        queryKey: ["article-categories", agentId],
        queryFn: () => getArticleCategories({ agentId }),
        enabled: open,
    });

    const categoryOptions = useMemo(() => {
        return categories.reduce(
            (acc, category) => {
                acc[category.name] = category.id;
                return acc;
            },
            {} as Record<string, number>,
        );
    }, [categories]);

    const createArticleMutation = useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            setOpen(false);
            onCreated();
            toast.success("Article created successfully");
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Create Article
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Article</DialogTitle>
                    <DialogDescription>
                        Create a new Article to be used in your application.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    className="grid gap-4"
                    onSubmit={createArticleMutation.mutateAsync}
                    defaultData={{
                        agentId: agentId,
                    }}
                >
                    <FormError />
                    <DevFormData />

                    <TextInputWidget
                        name={"title"}
                        label={"Title"}
                        description={"Title of the article"}
                    />

                    <TextInputWidget
                        name={"description"}
                        label={"Description"}
                        description={"Brief description of the article"}
                    />

                    <TextareaWidget
                        name={"content"}
                        label={"Content"}
                        description={"Full content of the article"}
                    />

                    <SelectInputWidget
                        name={"categoryId"}
                        label={"Category"}
                        description={"Category of the article"}
                        options={categoryOptions}
                        placeholder={"Select a category"}
                    />

                    <Submit>Create Article</Submit>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
