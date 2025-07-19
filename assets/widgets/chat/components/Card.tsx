import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUp, CircleEllipsis, X } from "lucide-react";
import { Message } from "@/widgets/chat/components/Message.tsx";
import { useChat } from "@/widgets/chat/hooks/useChat.ts";
import { useSendMessage } from "@/widgets/chat/hooks/useSendMessage.ts";

interface ChatCardProps {
    onClose: () => void;
}

const Card: React.FC<ChatCardProps> = ({ onClose }) => {
    const [message, setMessage] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { chat } = useChat();

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

    const { sendMessage, isLoading } = useSendMessage();

    const handleSendMessage = () => {
        if (!message.trim()) {
            return;
        }

        setMessage("");

        sendMessage({
            content: message,
        });
    };

    return (
        <div className="h-[600px] border border-border rounded-2xl relative w-[500px] shadow-lg bg-background">
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={onClose}
            >
                <X />
            </Button>

            <div className="p-4 flex-col gap-4 flex flex-1 h-full text-sm">
                <h2 className="text-2xl font-medium mb-4">
                    {chat?.configuration.name ?? ""}
                </h2>
                <div className="grow overflow-y-auto" ref={chatContainerRef}>
                    <div
                        ref={messagesContainerRef}
                        className="flex flex-col gap-6 text-sm"
                    >
                        {chat?.messages.map((message) => (
                            <Message {...message} key={message.id} />
                        ))}
                        {isLoading && (
                            <div className="animate-pulse text-muted-foreground">
                                <CircleEllipsis />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 bg-secondary p-2 rounded-full">
                    <input
                        className="grow px-3 focus:outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-primary hover:bg-primary/90 size-9 p-1 text-white rounded-full text-center flex items-center justify-center gap-1"
                    >
                        <ArrowUp className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
