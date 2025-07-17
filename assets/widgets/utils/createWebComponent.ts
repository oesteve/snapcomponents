import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
// @ts-expect-error Type 'string' is not assignable to type 'string & { __inline: true }'
import componentStyles from "@/widgets/index.css?inline";

// Create a single CSSStyleSheet instance for better performance
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(componentStyles);

// Setup hot module replacement for the CSS
// @ts-expect-error Property 'hot' does not exist on type 'ImportMeta'
if (import.meta.hot) {
    // @ts-expect-error Method 'accept' does not exist on type 'ImportMeta'
    import.meta.hot.accept("@/widgets/index.css?inline", (newModule) => {
        if (newModule) {
            // Update the stylesheet with the new CSS content
            styleSheet.replaceSync(newModule.default);
        }
    });
}

interface WebComponentOptions<P extends object> {
    // The tag name to register the web component with
    tagName: string;

    // React component to render inside the web component
    component: React.ComponentType<P>;

    // Optional array of attribute names to observe for changes
    observedAttributes?: string[];

    // Optional function to convert HTML attributes to React props
    mapAttributesToProps?: (el: HTMLElement) => P;

    // Optional shadow DOM mode, defaults to 'open'
    shadowMode?: "open" | "closed";

    // Optional callback when component is connected
    onConnected?: (el: HTMLElement) => void;

    // Optional callback when component is disconnected
    onDisconnected?: (el: HTMLElement) => void;

    // Optional CSS to be included in the shadow DOM (used as fallback for browsers that don't support adoptedStyleSheets)
    // Note: Global styles are automatically included, so this is only needed for additional component-specific styles
    css?: string;
}

/**
 * Creates a web component class from a React component
 */
export function createWebComponent<P extends object>(
    options: WebComponentOptions<P>,
): void {
    const {
        tagName,
        component,
        observedAttributes = [],
        mapAttributesToProps = () => ({}) as P,
        shadowMode = "open",
        onConnected,
        onDisconnected,
        css,
    } = options;

    class ReactWebComponent extends HTMLElement {
        private root: Root | null = null;
        private mountPoint: HTMLElement | null = null;

        constructor() {
            super();
            this.attachShadow({ mode: shadowMode });
        }

        connectedCallback() {
            // Apply the global stylesheet to the shadow DOM
            if (this.shadowRoot && "adoptedStyleSheets" in this.shadowRoot) {
                // Use adoptedStyleSheets for better performance
                this.shadowRoot.adoptedStyleSheets = [styleSheet];
            } else if (css) {
                // Fallback for browsers that don't support adoptedStyleSheets
                const style = document.createElement("style");
                style.textContent = css || componentStyles;
                this.shadowRoot!.appendChild(style);
            }

            // Create a container for our React component
            this.mountPoint = document.createElement("div");
            this.shadowRoot!.appendChild(this.mountPoint);

            // Create a React root and render our component
            this.root = createRoot(this.mountPoint);
            this.renderComponent();

            // Call the onConnected callback if provided
            if (onConnected) {
                onConnected(this);
            }
        }

        disconnectedCallback() {
            // Clean up React root when the element is removed from the DOM
            if (this.root) {
                this.root.unmount();
                this.root = null;
            }

            // Call the onDisconnected callback if provided
            if (onDisconnected) {
                onDisconnected(this);
            }
        }

        // Observe attributes for changes
        static get observedAttributes() {
            return observedAttributes;
        }

        attributeChangedCallback(
            _: string,
            oldValue: string,
            newValue: string,
        ) {
            if (oldValue !== newValue && this.root) {
                this.renderComponent();
            }
        }

        // Re-render the React component with updated props
        private renderComponent() {
            if (!this.root) return;

            const props = mapAttributesToProps(this);

            this.root.render(
                React.createElement(
                    React.StrictMode,
                    null,
                    React.createElement(component, props),
                ),
            );
        }
    }

    // Register the custom element
    if (!customElements.get(tagName)) {
        customElements.define(tagName, ReactWebComponent);
    }
}
