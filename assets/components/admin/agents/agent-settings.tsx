import {Form} from "@/components/form";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {type Agent, updateAgent} from "@/lib/agents/agents.ts";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {useMemo,} from "react";
import {toast} from "sonner";


interface AgentSettingsProps {
    agent: Agent;
}

export function AgentSettings({agent}: AgentSettingsProps) {

    const client = useQueryClient()

    const editAgentMutation = useMutation({
        mutationFn: updateAgent,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ['agent']
            })
            toast.success("Agent updated successfully")
        }
    })

    const defaultData = useMemo(() => ({
        id: agent.id,
        name: agent.name
    }), [agent]);

    return (
        <Form className="grid gap-4" onSubmit={editAgentMutation.mutateAsync} defaultData={defaultData}>

            <div>
                <div className="flex gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-medium">Setting</h1>
                        <p className="text-sm text-muted-foreground">
                            General settings for the agent.
                        </p>
                    </div>
                    <div className="ms-auto">
                        <Submit>
                            Save Changes
                        </Submit>
                    </div>
                </div>


                <div className="flex flex-col gap-4">
                    <FormError/>
                    <DevFormData/>

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the agent"}
                    />
                </div>


            </div>
        </Form>
    )
}
