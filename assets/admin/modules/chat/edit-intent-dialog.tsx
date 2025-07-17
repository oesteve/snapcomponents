import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import TextareaInputWidget from "@/components/form/widgets/textarea-input-widget.tsx";
import { TagInputWidget } from "@/components/form/widgets/tag-input-widget.tsx";
import { useEffect, useState } from "react";
import {
    useQueryTools,
    useQueryComponents,
} from "@/admin/modules/chat/lib/chat.ts";

interface EditIntentDialogProps {
    name: string;
    onClosed: () => void;
}

export function EditIntentDialog({ name, onClosed }: EditIntentDialogProps) {
    const [open, setOpen] = useState(true);
    const { data: tools = [], isLoading: isLoadingTools } = useQueryTools();
    const { data: components = {}, isLoading: isLoadingComponents } =
        useQueryComponents();

    // Convert tools to options array for TagInputWidget
    const toolOptions = tools.map((tool) => tool.name);

    // Convert components object to options array for TagInputWidget
    const componentOptions = Object.keys(components);

    useEffect(() => {
        if (!open) {
            setTimeout(onClosed, 300);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Intent {name}</DialogTitle>
                    <DialogDescription>
                        Adjust the configuration of the intent.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <TextInputWidget
                        name={`${name}.name`}
                        label={"Name"}
                        description={"Name used to identify the intent"}
                    />
                    <TextInputWidget
                        name={`${name}.description`}
                        label={"Description"}
                        description={"Description about the user description"}
                    />
                    <TextareaInputWidget
                        name={`${name}.instructions`}
                        label={"Instructions"}
                        description="The indication for the model when the user is in this intent."
                        className="font-mono"
                    />
                    <TagInputWidget
                        name={`${name}.tools`}
                        label={"Tools"}
                        description={
                            isLoadingTools
                                ? "Loading tools..."
                                : "Select the tools that can be used in this intent."
                        }
                        options={toolOptions}
                        placeholder="Search for a tool..."
                    />
                    <TagInputWidget
                        name={`${name}.widgets`}
                        label={"Components"}
                        description={
                            isLoadingComponents
                                ? "Loading components..."
                                : "Select the UI components that can be used in this intent."
                        }
                        options={componentOptions}
                        placeholder="Search for a component..."
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Back</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
