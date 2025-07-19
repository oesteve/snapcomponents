import { createFileRoute } from "@tanstack/react-router";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Form } from "@/components/form";
import Submit from "@/components/form/submit.tsx";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import TextareaInputWidget from "@/components/form/widgets/textarea-input-widget.tsx";
import { TagInputWidget } from "@/components/form/widgets/tag-input-widget.tsx";
import { useMutation } from "@tanstack/react-query";
import {
    updateIntent,
    useQueryComponents,
    useQueryTools,
} from "@/admin/modules/chat/lib/chat.ts";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { getChatConfig } from "@/admin/modules/chat/lib/chat.ts";
import { useMemo } from "react";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";

export const Route = createFileRoute(
    "/admin/agents/$agentId/chat/intents/$intentId",
)({
    beforeLoad: ({ context }) => ({
        ...context,
        breadcrumbs: [
            { label: "Admin", href: "/admin" },
            { label: "Agents", href: "/admin/agents" },
            {
                label: context.agent.name,
                href: `/admin/agents/${context.agent.id}/settings`,
            },
            { label: "Chat", href: `/admin/agents/${context.agent.id}/chat` },
            {
                label: "Intents",
                href: `/admin/agents/${context.agent.id}/intents`,
            },
            { label: "configuration", isActive: true },
        ],
    }),
    component: UpdateIntent,
    loader: async ({ params: { agentId, intentId } }) => {
        const id = parseInt(agentId);
        const chatConfig = await getChatConfig(id);

        if (!chatConfig) {
            throw new Error(`Chat configuration not found for agent ${id}`);
        }

        // Find the intent with the matching ID
        const intent = chatConfig.intents.find(
            (intent) => intent.id === parseInt(intentId),
        );

        if (!intent) {
            throw new Error(`Intent with ID ${intentId} not found`);
        }

        return {
            intent,
        };
    },
});

function UpdateIntent() {
    const agent = useCurrentAgent();
    const { intent } = Route.useLoaderData();

    const navigate = useNavigate();
    const { data: tools = [] } = useQueryTools(agent.id);
    const { data: components = {} } = useQueryComponents(agent.id);

    // Convert tools to options array for TagInputWidget
    const toolOptions = tools.map((tool) => tool.name);

    // Convert components object to options array for TagInputWidget
    const componentOptions = Object.keys(components);

    const updateIntentMutation = useMutation({
        mutationFn: updateIntent,
        onSuccess: () => {
            toast.success("Intent updated successfully");
            navigate({ to: `/admin/agents/${agent.id}/chat` });
        },
    });

    const defaultData = useMemo(
        () => ({
            id: intent.id,
            agentId: agent.id,
            name: intent.name,
            description: intent.description,
            instructions: intent.instructions,
            tools: intent.tools || [],
            widgets: intent.widgets || [],
        }),
        [intent],
    );

    return (
        <Form
            onSubmit={updateIntentMutation.mutateAsync}
            defaultData={defaultData}
            className="w-full items-center"
        >
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Update Intent</CardTitle>
                    <CardDescription>
                        Modify the configuration for this intent
                    </CardDescription>
                    <CardAction>
                        <Submit>Update Intent</Submit>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormError />
                    <DevFormData />

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the intent"}
                    />

                    <TextInputWidget
                        name={"description"}
                        label={"Description"}
                        description={"Description about the user intent"}
                    />

                    <TextareaInputWidget
                        name={"instructions"}
                        label={"Instructions"}
                        description="The indication for the model when the user is in this intent."
                        className="font-mono"
                    />

                    <TagInputWidget
                        name={"tools"}
                        label={"Tools"}
                        description="Select the tools that can be used in this intent."
                        options={toolOptions}
                        placeholder="Search for a tool..."
                    />

                    <TagInputWidget
                        name={"widgets"}
                        label={"Components"}
                        description="Select the UI components that can be used in this intent."
                        options={componentOptions}
                        placeholder="Search for a component..."
                    />
                </CardContent>
            </Card>
        </Form>
    );
}
