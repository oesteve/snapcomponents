import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useChatStoreBase } from "@/widgets/chat/store/useChatStore";

const footerVariants = cva("flex gap-2 bg-secondary p-2", {
    variants: {
        variant: {
            flat: "border-t",
            default: "rounded-full m-2",
        },
        variantExpanded: {
            flat: "border rounded-lg md:my-4",
            default: "md:my-4",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export type FooterProps = VariantProps<typeof footerVariants> & {
    placeholder?: string;
};

const Footer: React.FC<FooterProps> = ({ placeholder, variant }) => {
    const sendMessage = useChatStoreBase((state) => state.sendMessage);
    const isOpen = useChatStoreBase((state) => state.isOpen);
    const isExpanded = useChatStoreBase((state) => state.isExpanded);
    const chatId = useChatStoreBase((store) => store.chat?.id);

    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = () => {
        if (!message.trim()) {
            return;
        }

        setMessage("");

        sendMessage({
            content: message,
        });
    };

    useEffect(() => {
        if (!inputRef.current || (!isOpen && !isExpanded)) {
            return;
        }

        inputRef.current.focus();
    }, [isOpen, isExpanded, inputRef.current, chatId]);

    return (
        <div className={cn("w-full max-w-3xl mx-auto")}>
            <div
                className={cn(
                    footerVariants({
                        variant,
                        variantExpanded: isExpanded ? variant : undefined,
                    }),
                )}
            >
                <input
                    className="grow px-3 focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={placeholder ?? "Type your message..."}
                    ref={inputRef}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-primary/90 size-9 p-1 text-white rounded-full text-center flex items-center justify-center gap-1"
                >
                    <ArrowUp className="size-6" />
                </button>
            </div>
        </div>
    );
};

export default Footer;
