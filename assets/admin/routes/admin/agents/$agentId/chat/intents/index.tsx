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
    createIntent,
    useQueryComponents,
    useQueryTools,
} from "@/lib/agents/chat.ts";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/agents/$agentId/chat/intents/")({
    beforeLoad: ({ context }) => {
        const agent = context.agent;
        return {
            ...context,
            breadcrumbs: [
                { label: "Admin", href: "/admin" },
                { label: "Agents", href: "/admin/agents" },
                {
                    label: agent.name,
                    href: `/admin/agents/${agent.id}/settings`,
                },
                { label: "Chat", href: `/admin/agents/${agent.id}/chat` },
                { label: "Intents", href: `/admin/agents/${agent.id}/intents` },
                { label: "Create new intent", isActive: true },
            ],
        };
    },
    component: CreateIntent,
});

function CreateIntent() {
    const { agentId } = Route.useParams();
    const navigate = useNavigate();
    const { data: tools = [], isLoading: isLoadingTools } = useQueryTools();
    const { data: components = {}, isLoading: isLoadingComponents } =
        useQueryComponents();

    // Convert tools to options array for TagInputWidget
    const toolOptions = tools.map((tool) => tool.name);

    // Convert components object to options array for TagInputWidget
    const componentOptions = Object.keys(components);

    const createIntentMutation = useMutation({
        mutationFn: createIntent,
        onSuccess: () => {
            toast.success("Intent created successfully");
            navigate({ to: `/admin/agents/${agentId}/chat` });
        },
    });

    const defaultData = {
        configurationId: parseInt(agentId),
        name: "",
        description: "",
        instructions: "",
        tools: [],
        widgets: [],
    };

    return (
        <Form
            onSubmit={createIntentMutation.mutateAsync}
            defaultData={defaultData}
            className="w-full items-center"
        >
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Create Intent</CardTitle>
                    <CardDescription>
                        Create a new intent for your agent to handle specific
                        user requests
                    </CardDescription>
                    <CardAction>
                        <Submit>Create Intent</Submit>
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
                        description={
                            isLoadingTools
                                ? "Loading tools..."
                                : "Select the tools that can be used in this intent."
                        }
                        options={toolOptions}
                        placeholder="Search for a tool..."
                    />

                    <TagInputWidget
                        name={"widgets"}
                        label={"Components"}
                        description={
                            isLoadingComponents
                                ? "Loading components..."
                                : "Select the UI components that can be used in this intent."
                        }
                        options={componentOptions}
                        placeholder="Search for a component..."
                    />
                </CardContent>
            </Card>
        </Form>
    );
}
