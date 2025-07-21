import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MessageCircle } from "lucide-react";
import Card from "./Card.tsx";
import { cn } from "@/lib/utils";
import { useChatStoreBase } from "@/widgets/chat/store/useChatStore";
import { useStyleProperty } from "@/widgets/chat/hooks/useStyleProperty";

interface ChatProps {
    initialCount?: number;
}

const Chat: React.FC<ChatProps> = () => {
    const ref = useRef<HTMLDivElement>(null);
    const fetchChat = useChatStoreBase((state) => state.fetchChat);
    const chat = useChatStoreBase((state) => state.chat);
    const isOpen = useChatStoreBase((state) => state.isOpen);
    const openChat = useChatStoreBase((state) => state.openChat);
    const closeChat = useChatStoreBase((state) => state.closeChat);

    // Fetch chat data on component mount (from ChatComponent)
    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    // Add escape key listener to close the chat (from ChatComponent)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                closeChat();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeChat]);

    const footerVariant = useStyleProperty<string>(ref, "card-footer-variant");

    const footerPlaceholder = useStyleProperty<string>(
        ref,
        "card-footer-placeholder",
    );

    // Render UI (from ChatContent)
    return (
        <div
            className={cn(
                "opacity-0 transition-opacity fixed bottom-0 right-0 z-50 m-4 md:m-8",
                chat && "opacity-100",
            )}
            ref={ref}
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
                <Card
                    onClose={closeChat}
                    variant={footerVariant}
                    placeholder={footerPlaceholder}
                />
            )}
        </div>
    );
};

export default Chat;
