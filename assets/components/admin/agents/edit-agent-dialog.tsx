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
import {type Agent, updateAgent} from "@/lib/agents/agents.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {useMemo, useState} from "react";
import { toast } from "sonner";


interface EditAgentDialogProps {
    agent: Agent;
    onEdited: () => void;
    trigger?: React.ReactNode;
}

export function EditAgentDialog({agent, onEdited, trigger}: EditAgentDialogProps) {
    const [open, setOpen] = useState(false)
    const editAgentMutation = useMutation({
        mutationFn: updateAgent,
        onSuccess: () => {
            setOpen(false)
            onEdited()
            toast.success("Agent updated successfully")
        }
    })

    const defaultData = useMemo( () => ({
        id: agent.id,
        name: agent.name
    }), [agent]);

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
                    <DialogTitle>Edit Agent</DialogTitle>
                    <DialogDescription>
                        Edit the agent information.
                    </DialogDescription>
                </DialogHeader>
                <Form className="grid gap-4" onSubmit={editAgentMutation.mutateAsync} defaultData={defaultData}>
                    <FormError/>
                    <DevFormData/>

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the agent"}
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
