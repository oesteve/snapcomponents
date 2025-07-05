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
import { type Agent, removeAgent } from "@/lib/agents/agents.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useState } from "react";
import { toast } from "sonner";

interface RemoveAgentDialogProps {
    agent: Agent;
    onRemoved: () => void;
}

export function RemoveAgentDialog({
    agent,
    onRemoved,
}: RemoveAgentDialogProps) {
    const [open, setOpen] = useState(false);

    const removeAgentMutation = useMutation({
        mutationFn: () => removeAgent(agent.id),
        onSuccess: () => {
            setOpen(false);
            onRemoved();
            toast.warning("Agent removed successfully.");
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
                    <DialogTitle>Remove Agent</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove the agent "{agent.name}
                        "? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    className="grid gap-4"
                    onSubmit={removeAgentMutation.mutateAsync}
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
                        <Submit variant="destructive">Remove Agent</Submit>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
