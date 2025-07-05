import {createFileRoute} from "@tanstack/react-router";
import {getAgent} from "@/lib/agents/agents";
import {useLayoutStore} from "@/admin/components/layout/breadcrumb-store.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Form} from "@/components/form";
import Submit from "@/components/form/submit.tsx";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import TextareaInputWidget from "@/components/form/widgets/textarea-input-widget.tsx";

import {getChatConfig, updateChatConfig} from "@/lib/agents/chat.ts";
import {IntentsWidget} from "@/admin/components/agents/chat/intents-widget.tsx";
import {useMemo} from "react";

export const Route = createFileRoute('/admin/agents/$agentId/chat')({
    component: ChatRoute,
    loader: async ({params: {agentId}}) => {
        const id = parseInt(agentId);
        const agent = await getAgent(id)
        const chatConfig = await getChatConfig(id)

        const layout = useLayoutStore.getState();

        layout.setBreadcrumbs([
            {label: "Admin", href: "/admin"},
            {label: "Agents", href: "/admin/agents"},
            {label: agent.name},
            {label: "Chat", isActive: true}
        ])

        layout.setAgent(agent)


        return {
            agent,
            chatConfig
        }
    }
})


export function ChatRoute() {
    const {
        agent,
        chatConfig
    } = Route.useLoaderData()

    const updateChatSettingsMutation = useMutation({
        mutationFn: updateChatConfig,
        onSuccess: () => {
            toast.success("Agent updated successfully")
        }
    })

    const defaultData = useMemo(() => ({
        agentId: agent.id,
        ...chatConfig,
    }), [agent, chatConfig])

    return (
        <Form onSubmit={updateChatSettingsMutation.mutateAsync}
              defaultData={defaultData} className="w-full items-center">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>
                        Chat bot settings for the agent.
                    </CardTitle>
                    <CardDescription>
                        Adjust the chat bot settings for the agent installed on your website.
                    </CardDescription>
                    <CardAction>
                        <Submit>
                            Save Changes
                        </Submit>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormError/>
                    <DevFormData/>

                    <TextareaInputWidget
                        name={"instructions"}
                        label={"Instruction"}
                        className="font-mono"
                        description={"The instructions provided to the model."}
                    />

                    <IntentsWidget
                        name={"intents"}
                        label={"Intents"}
                        description="Define the behaviur of the chat base in the user intents."
                    />

                </CardContent>
            </Card>
        </Form>
    )

}
