import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Edit} from "lucide-react";
import {Form} from "@/components/form";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import {useMutation} from "@tanstack/react-query";
import {type Article, updateArticle} from "@/lib/articles/articles.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {useMemo, useState} from "react";
import {toast} from "sonner";
import TextareaWidget from "@/components/form/widgets/textarea-input-widget";

interface EditArticleDialogProps {
    article: Article;
    onEdited: () => void;
    trigger?: React.ReactNode;
}

export function EditArticleDialog({article, onEdited, trigger}: EditArticleDialogProps) {
    const [open, setOpen] = useState(false)
    const editArticleMutation = useMutation({
        mutationFn: updateArticle,
        onSuccess: () => {
            setOpen(false)
            onEdited()
            toast.success("Article updated successfully")
        }
    })

    const defaultData = useMemo(() => ({
        id: article.id,
        name: article.name,
        title: article.title,
        description: article.description,
        content: article.content
    }), [article]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4"/>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                    <DialogDescription>
                        Edit the article information.
                    </DialogDescription>
                </DialogHeader>
                <Form className="grid gap-4" onSubmit={editArticleMutation.mutateAsync} defaultData={defaultData}>
                    <FormError/>
                    <DevFormData/>

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the article"}
                    />

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

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)} type="button">
                            Cancel
                        </Button>
                        <Submit>
                            Save Changes
                        </Submit>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
