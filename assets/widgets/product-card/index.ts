import ProductCard, { type ProductCardProps } from "./ProductCard";
import { createWebComponent } from "../utils/createWebComponent";

// Register the ProductCard component as a web component
createWebComponent({
    tagName: "wg-product-card",
    component: ProductCard,
    mapAttributesToProps: (el) => {
        const attr = el.attributes;

        const onAddProductToCart = () => {
            // Create a custom event with product details
            const addToCartEvent = new CustomEvent("add-to-cart", {
                bubbles: true, // Allow the event to bubble up through the DOM
                composed: true,
                detail: {
                    title: attr.getNamedItem("title")!.value,
                    image: attr.getNamedItem("image")!.value,
                    price: parseFloat(attr.getNamedItem("price")!.value),
                },
            });

            // Dispatch the event
            el.dispatchEvent(addToCartEvent);
        };

        const props: ProductCardProps = {
            title: attr.getNamedItem("title")!.value,
            image: attr.getNamedItem("image")!.value,
            price: parseFloat(attr.getNamedItem("price")!.value),
            onAddProductToCart,
        };

        return props;
    },
});
