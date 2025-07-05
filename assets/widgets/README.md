# React to Web Components Utility

This utility provides a simple way to convert React components into Web Components (Custom Elements) that can be used in any HTML page, regardless of the framework or library being used.

## Overview

The `createWebComponent` utility function wraps a React component in a Web Component, allowing you to use React components as custom HTML elements in your application.

## Usage

### Basic Usage

```typescript
import { createWebComponent } from "./utils/createWebComponent";
import MyReactComponent from "./MyReactComponent";

createWebComponent({
    tagName: "my-element",
    component: MyReactComponent,
    observedAttributes: ["some-attribute"],
    mapAttributesToProps: (el) => {
        // Convert HTML attributes to React props
        const someValue = el.getAttribute("some-attribute") || "default";
        return { someValue };
    },
});
```

Then use it in your HTML:

```html
<my-element some-attribute="value"></my-element>
```

### API Reference

The `createWebComponent` function accepts a configuration object with the following properties:

#### Required Properties

- `tagName` (string): The name of the custom element to register. Must contain a hyphen.
- `component` (React.ComponentType): The React component to render inside the web component.

#### Optional Properties

- `observedAttributes` (string[]): An array of attribute names to observe for changes. When these attributes change, the React component will be re-rendered with the new values.
- `mapAttributesToProps` (function): A function that maps HTML attributes to React props. It receives the HTML element as an argument and should return an object of props to pass to the React component.
- `shadowMode` ('open' | 'closed'): The mode of the shadow DOM. Defaults to 'open'.
- `onConnected` (function): A callback function that is called when the element is connected to the DOM.
- `onDisconnected` (function): A callback function that is called when the element is disconnected from the DOM.

## Examples

### Chat Widget

```typescript
import ChatComponent from "./ChatComponent";
import { createWebComponent } from "../utils/createWebComponent";

createWebComponent({
    tagName: "wg-chat",
    component: ChatComponent,
    observedAttributes: ["initial-count"],
    mapAttributesToProps: (el) => {
        const initialCount = el.hasAttribute("initial-count")
            ? parseInt(el.getAttribute("initial-count")!, 10)
            : 0;

        return { initialCount };
    },
});
```

### Counter Widget

```typescript
import SimpleCounter from "./SimpleCounter";
import { createWebComponent } from "../utils/createWebComponent";

createWebComponent({
    tagName: "wg-counter",
    component: SimpleCounter,
    observedAttributes: ["initial-value", "label"],
    mapAttributesToProps: (el) => {
        const initialValue = el.hasAttribute("initial-value")
            ? parseInt(el.getAttribute("initial-value")!, 10)
            : 0;

        const label = el.hasAttribute("label")
            ? el.getAttribute("label")!
            : "Counter";

        return { initialValue, label };
    },
});
```

## Benefits

- **Framework Agnostic**: Use React components in any web application, regardless of the framework.
- **Encapsulation**: Web Components provide strong encapsulation through Shadow DOM.
- **Reusability**: Package your React components as Web Components for easy reuse.
- **Progressive Enhancement**: Add React-powered functionality to existing applications without a full rewrite.

## Limitations

- **Styling**: Styles are encapsulated within the Shadow DOM, so global styles won't affect the component.
- **Events**: Custom events must be used to communicate between the Web Component and the rest of the application.
- **Server-Side Rendering**: Web Components are client-side only, so they won't work with server-side rendering.
