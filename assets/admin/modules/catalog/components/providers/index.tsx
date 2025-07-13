import type { Provider } from "@/admin/modules/catalog/lib/products.ts";
import { Elasticsearch } from "./elasticsearch.tsx";
import React from "react";
import { useFieldData } from "@/components/form";

// Map of provider names to their respective components
const ProviderComponents: Record<
    string,
    React.ComponentType<{ provider?: Provider }>
> = {
    elasticsearch: Elasticsearch,
    // Add more providers here as they are implemented
};

export function ProviderConfig() {
    const providerName = useFieldData<string>("name");

    // Get the component for the provider type
    const ProviderComponent = ProviderComponents[providerName.toLowerCase()];

    // If no component is found for the provider type, show a message
    if (!ProviderComponent) {
        return (
            <div className="text-red-500">
                No configuration available for provider: {providerName}
            </div>
        );
    }

    // Render the provider-specific component with the provider prop
    return <ProviderComponent />;
}
