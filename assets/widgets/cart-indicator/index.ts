import CartIndicator from "./CartIndicator";
import { createWebComponent } from "../utils/createWebComponent";

// Register the CartIndicator component as a web component
createWebComponent({
    tagName: "wg-cart-indicator",
    component: CartIndicator,
    observedAttributes: ["initial-value"],
    mapAttributesToProps: (el) => {
        // Convert HTML attributes to React props
        const initialValue = el.hasAttribute("initial-value")
            ? parseInt(el.getAttribute("initial-value")!, 10)
            : 0;

        return { initialValue };
    },
    onConnected: (el) => {
        // Add a document-level event listener for the 'add-to-cart' event
        document.addEventListener("add-to-cart", () => {
            console.log("Cart indicator updated");

            // Get the current value
            const currentValue = el.hasAttribute("initial-value")
                ? parseInt(el.getAttribute("initial-value")!, 10)
                : 0;

            // Increment the value
            const newValue = currentValue + 1;

            // Update the attribute to trigger a re-render
            el.setAttribute("initial-value", newValue.toString());

            console.log("Cart indicator updated:", newValue);
        });
    },
});

console.log("CartIndicator web component registered as wg-cart-indicator");
