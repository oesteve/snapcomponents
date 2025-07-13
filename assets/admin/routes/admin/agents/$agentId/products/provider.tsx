import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
    getProvider,
    getProviders,
    setProvider,
} from "@/admin/modules/catalog/lib/products.ts";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Form } from "@/components/form";
import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";
import SelectInputWidget from "@/components/form/widgets/select-input-widget.tsx";
import Submit from "@/components/form/submit.tsx";
import { ProviderConfig } from "@/admin/modules/catalog/components/providers";
import DevFormData from "@/components/form/dev-form-data.tsx";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute(
    "/admin/agents/$agentId/products/provider",
)({
    beforeLoad: () => ({
        title: "Settings",
    }),
    component: ProductsSettingsPage,
    loader: async ({ context }) => {
        return {
            provider: await getProvider(context.agent.id),
            providers: await getProviders(context.agent.id),
        };
    },
});

function ProductsSettingsPage() {
    const agent = useCurrentAgent();
    const router = useRouter();

    const updateProviderMutation = useMutation({
        mutationFn: setProvider,
        onSuccess: () => {
            toast.success("Provider updated successfully");
            router.navigate({
                to: "/admin/agents/$agentId/products",
                params: {
                    agentId: agent.id.toString(),
                },
            });
        },
    });

    const { providers, provider } = Route.useLoaderData();

    const defaultData = {
        agentId: agent.id,
        name: provider.name,
        settings: provider.settings,
    };

    const providerOptions = providers.reduce(
        (acc, provider) => {
            acc[provider.name] = provider.name;
            return acc;
        },
        {} as Record<string, string>,
    );

    return (
        <Form
            defaultData={defaultData}
            onSubmit={updateProviderMutation.mutateAsync}
            className="w-full items-center"
        >
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Product Provider Settings</CardTitle>
                    <CardDescription>
                        Adjust the product provider settings for the agent
                        installed on
                    </CardDescription>
                    <CardAction>
                        <Submit>Save Changes</Submit>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <DevFormData />
                    <SelectInputWidget
                        name="name"
                        label="Provider"
                        description="Select the provider to use"
                        options={providerOptions}
                    />

                    <ProviderConfig />
                </CardContent>
            </Card>
        </Form>
    );
}
