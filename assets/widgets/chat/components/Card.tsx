import React, { useRef, useEffect, useMemo } from "react";
import { Message } from "@/widgets/chat/components/Message.tsx";
import { useChat } from "@/widgets/chat/hooks/useChat.ts";
import { useStyleProperty } from "@/widgets/chat/hooks/useStyleProperty.ts";
import ChatLoading from "@/widgets/chat/components/ChatLoading.tsx";
import CardFooter, {
    type CardFooterProps,
} from "@/widgets/chat/components/CardFooter.tsx";
import CardHeader, {
    type CardHeaderProps,
} from "@/widgets/chat/components/CardHeader.tsx";

interface ChatCardProps {
    onClose: () => void;
}

const Card: React.FC<ChatCardProps> = ({ onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { chat, isLoading } = useChat();

    function scrollToBottom() {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }

    const resizeObserver = useMemo(() => {
        return new ResizeObserver(() => {
            scrollToBottom();
        });
    }, []);

    useEffect(() => {
        if (!messagesContainerRef.current) {
            resizeObserver.disconnect();
            return;
        }

        resizeObserver.observe(messagesContainerRef.current);
    }, [messagesContainerRef.current, resizeObserver]);

    if (!chat) {
        return null;
    }

    const footerVariant = useStyleProperty<CardFooterProps["variant"]>(
        ref,
        "card-footer-variant",
    );

    const headerVariant = useStyleProperty<CardHeaderProps["variant"]>(
        ref,
        "card-header-variant",
    );

    return (
        <div
            className="h-[700px] border border-border rounded-2xl relative w-[500px] shadow-lg bg-background overflow-hidden"
            ref={ref}
        >
            <div className="flex-col flex flex-1 h-full text-sm">
                <CardHeader variant={headerVariant} onClose={onClose} />
                <div
                    className="grow overflow-y-auto p-3"
                    ref={chatContainerRef}
                >
                    <div
                        ref={messagesContainerRef}
                        className="flex flex-col gap-6 text-sm"
                    >
                        {chat.messages.map((message) => (
                            <Message {...message} key={message.id} />
                        ))}
                        {isLoading && chat.messages.length > 0 && (
                            <ChatLoading />
                        )}
                    </div>
                </div>
                <CardFooter variant={footerVariant} />
            </div>
        </div>
    );
};

export default Card;
