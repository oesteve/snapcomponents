import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { MessageCircle } from "lucide-react";
import Card from "./Card.tsx";
import { useChat } from "@/widgets/chat/hooks/useChat";
import { cn } from "@/lib/utils";

const ChatContent: React.FC = () => {
    const { chat, isOpen, openChat, closeChat } = useChat();

    return (
        <div
            className={cn(
                "opacity-0 transition-opacity",
                chat && "opacity-100",
            )}
        >
            {!isOpen ? (
                <Button
                    onClick={openChat}
                    variant="outline"
                    size="icon"
                    className="size-16 rounded-full shadow-lg"
                >
                    <MessageCircle className="size-8" />
                </Button>
            ) : (
                <Card onClose={closeChat} />
            )}
        </div>
    );
};

export default ChatContent;
