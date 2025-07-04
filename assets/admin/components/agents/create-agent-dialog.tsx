import {Button} from "@/components/ui/button.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {Plus} from "lucide-react";
import {Form} from "@/components/form";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import {useMutation} from "@tanstack/react-query";
import {createAgent} from "@/lib/agents/agents.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {useState} from "react";
import {toast} from "sonner";


interface CreateAgentDialogProps {
    onCreated: () => void;
}

export function CreateAgentDialog({onCreated}: CreateAgentDialogProps) {

    const [open, setOpen] = useState(false)


    const createAgentMutation = useMutation({
        mutationFn: createAgent,
        onSuccess: () => {
            setOpen(false)
            onCreated()
            toast.success("Agent created successfully")
        }
    })


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus/>Create Agent
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Agent</DialogTitle>
                    <DialogDescription>
                        Create a new Agent to be used in your application.
                    </DialogDescription>
                </DialogHeader>
                <Form className="grid gap-4" onSubmit={createAgentMutation.mutateAsync}>
                    <FormError/>
                    <DevFormData/>

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identifier the agent"}
                    />

                    <Submit>
                        Create Agent
                    </Submit>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
