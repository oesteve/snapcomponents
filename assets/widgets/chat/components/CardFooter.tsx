import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useChat } from "@/widgets/chat/hooks/useChat.ts";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const footerVariants = cva("flex gap-2 bg-secondary p-2", {
    variants: {
        variant: {
            flat: "border-t",
            default: "rounded-full m-2",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export type CardFooterProps = VariantProps<typeof footerVariants>;

const CardFooter: React.FC<CardFooterProps> = ({ variant }) => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useChat();

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
        <div className={cn(footerVariants({ variant }))}>
            <input
                className="grow px-3 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
            />
            <button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary/90 size-9 p-1 text-white rounded-full text-center flex items-center justify-center gap-1"
            >
                <ArrowUp className="size-6" />
            </button>
        </div>
    );
};

export default CardFooter;
