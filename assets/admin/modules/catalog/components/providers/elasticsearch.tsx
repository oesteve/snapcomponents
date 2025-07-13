import NumberInputWidget from "@/components/form/widgets/number-input-widget.tsx";

export function Elasticsearch() {
    return (
        <>
            <NumberInputWidget
                name="settings.num_of_products"
                label="Number of products"
                description="The number of products to fetch"
            />
        </>
    );
}
