import React from "react";
import ChatContent from "./ChatContent.tsx";

interface ChatComponentProps {
    initialCount?: number;
}

const ChatComponent: React.FC<ChatComponentProps> = () => {
    return <ChatContent />;
};

export default ChatComponent;
