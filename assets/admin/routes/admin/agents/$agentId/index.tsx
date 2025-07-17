import { createFileRoute } from "@tanstack/react-router";
import { updateAgent } from "@/lib/agents/agents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";
import { Form } from "@/components/form";
import Submit from "@/components/form/submit.tsx";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import TextInputWidget from "@/components/form/widgets/text-input-widget.tsx";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";

export const Route = createFileRoute("/admin/agents/$agentId/")({
    beforeLoad: () => ({
        title: "Settings",
    }),
    component: Settings,
});

export function Settings() {
    const agent = useCurrentAgent();
    const client = useQueryClient();

    const editAgentMutation = useMutation({
        mutationFn: updateAgent,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["agent"],
            });
            toast.success("Agent updated successfully");
        },
    });

    const defaultData = useMemo(
        () => ({
            id: agent.id,
            name: agent.name,
        }),
        [agent.id],
    );

    return (
        <Form
            onSubmit={editAgentMutation.mutateAsync}
            defaultData={defaultData}
            className="w-full items-center"
        >
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>General settings for the agent.</CardTitle>
                    <CardDescription>
                        Adjust the general settings for the agent installed on
                        your website.
                    </CardDescription>
                    <CardAction>
                        <Submit>Save Changes</Submit>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormError />
                    <DevFormData />

                    <TextInputWidget
                        name={"name"}
                        label={"Name"}
                        description={"Name used to identify the agent"}
                    />
                </CardContent>
            </Card>
        </Form>
    );
}
