import Chat from "./components/Chat.tsx";
import { createWebComponent } from "@/widgets/utils/createWebComponent.ts";

// Register the chat component as a web component
createWebComponent({
    tagName: "wg-chat",
    component: Chat,
});
