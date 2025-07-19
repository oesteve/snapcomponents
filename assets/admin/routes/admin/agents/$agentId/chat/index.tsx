import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form } from "@/components/form";
import Submit from "@/components/form/submit.tsx";
import FormError from "@/components/form/form-error.tsx";
import DevFormData from "@/components/form/dev-form-data.tsx";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import TextareaInputWidget from "@/components/form/widgets/textarea-input-widget.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {
    getChatConfig,
    removeIntent,
    setChatSettings,
} from "@/admin/modules/chat/lib/chat.ts";
import { type MouseEvent, useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { FormDescription } from "@/components/form/form-description.tsx";
import { Plus, Trash2 } from "lucide-react";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";
import TextInputWidget from "@/components/form/widgets/text-input-widget";

export const Route = createFileRoute("/admin/agents/$agentId/chat/")({
    component: ChatRoute,
    beforeLoad: () => {
        return {
            title: "Chat",
        };
    },
    loader: async ({ params: { agentId } }) => {
        const id = parseInt(agentId);
        const chatConfig = await getChatConfig(id);
        return {
            chatConfig,
        };
    },
});

export function ChatRoute() {
    const route = useRouter();
    const agent = useCurrentAgent();
    const { chatConfig } = Route.useLoaderData();

    const updateChatSettingsMutation = useMutation({
        mutationFn: setChatSettings,
        onSuccess: () => {
            toast.success("Agent updated successfully");
        },
    });

    const removeIntentMutation = useMutation({
        mutationFn: removeIntent,
        onSuccess: () => {
            route.invalidate();
            toast.success("Intent removed successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    function handleRemoveIntent(e: MouseEvent, id: number) {
        e.preventDefault();
        removeIntentMutation.mutate({
            agentId: agent.id,
            id,
        });
    }

    const defaultData = useMemo(
        () => ({
            agentId: agent.id,
            ...chatConfig,
        }),
        [agent, chatConfig],
    );

    return (
        <Form
            onSubmit={updateChatSettingsMutation.mutateAsync}
            defaultData={defaultData}
            className="w-full items-center"
        >
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Chat bot settings for the agent.</CardTitle>
                    <CardDescription>
                        Adjust the chat bot settings for the agent installed on
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
                        description={"The title shown in the chat panel"}
                    />

                    <TextareaInputWidget
                        name={"instructions"}
                        label={"Instruction"}
                        className="font-mono"
                        description={"The instructions provided to the model."}
                    />

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <Label>Intents</Label>
                                <FormDescription>
                                    Define the behavior of the chat based on
                                    user intents.
                                </FormDescription>
                            </div>
                            <Button variant="outline" asChild size="sm">
                                <Link
                                    to="/admin/agents/$agentId/chat/intents"
                                    params={{ agentId: agent.id.toString() }}
                                    className="flex items-center space-x-2"
                                >
                                    <Plus />
                                    <span>Add Intent</span>
                                </Link>
                            </Button>
                        </div>
                        <div className="w-full">
                            <Table className="max-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chatConfig?.intents.map((intent) => (
                                        <TableRow key={intent.id}>
                                            <TableCell>
                                                <Button
                                                    variant="link"
                                                    asChild
                                                    size="sm"
                                                >
                                                    <Link
                                                        to="/admin/agents/$agentId/chat/intents/$intentId"
                                                        params={{
                                                            agentId:
                                                                agent.id.toString(),
                                                            intentId:
                                                                intent.id.toString(),
                                                        }}
                                                    >
                                                        {intent.name}
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                            <TableCell className="overflow-ellipsis whitespace-normal">
                                                {intent.description}
                                            </TableCell>
                                            <TableCell className="text-end">
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={(e) =>
                                                        handleRemoveIntent(
                                                            e,
                                                            intent.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Form>
    );
}
