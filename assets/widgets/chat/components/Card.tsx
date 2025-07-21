import React, { useRef, useEffect, useState } from "react";
import { Message } from "@/widgets/chat/components/Message.tsx";
import Loading from "@/widgets/chat/components/Loading.tsx";
import Footer, { type FooterProps } from "@/widgets/chat/components/Footer.tsx";
import Header, { type HeaderProps } from "@/widgets/chat/components/Header.tsx";
import { cn } from "@/lib/utils";
import { useChatStoreBase } from "@/widgets/chat/store/useChatStore";

interface ChatCardProps {
    onClose: () => void;
    variant?: string;
    placeholder?: string;
}

const Card: React.FC<ChatCardProps> = ({ variant, placeholder }) => {
    const [scrollBehavior, setScrollBehavior] =
        useState<ScrollBehavior>("instant");
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const chat = useChatStoreBase((state) => state.chat);
    const isLoading = useChatStoreBase((state) => state.isLoading);
    const isExpanded = useChatStoreBase((state) => state.isExpanded);
    const chatMessage = useChatStoreBase((state) => state.chat?.messages);

    useEffect(() => {
        setAutoScrollEnabled(true);
        setTimeout(() => {
            setAutoScrollEnabled(false);
        }, 5000);
    }, [chatMessage]);

    useEffect(() => {
        setTimeout(() => {
            setScrollBehavior("smooth");
        }, 1000);
    }, []);

    // Add auto scroll to bottom when the messagesContainerRef resized
    useEffect(() => {
        if (!autoScrollEnabled || !messagesContainerRef.current) {
            return;
        }

        // Set up resize observer to detect container size changes
        const resizeObserver = new ResizeObserver(() => {
            setTimeout(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollIntoView({
                        behavior: scrollBehavior,
                        block: "end",
                    });
                }
            }, 1);
        });

        resizeObserver.observe(messagesContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [autoScrollEnabled, messagesContainerRef, scrollBehavior]);

    // Disable main document scroll when chat is expanded
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            // Ensure scroll is re-enabled when component unmounts
            document.body.style.overflow = "";
        };
    }, [isExpanded]);

    if (!chat) {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed top-0 left-0 h-dvh w-dvw shadow-lg bg-background overflow-hidden md:relative md:h-[700px] md:max-h-[90dvh] md:w-[500px] md:border md:border-border md:rounded-2xl",
                isExpanded &&
                    "md:fixed md:h-dvh md:w-dvw md:max-h-dvh md:max-w-dvw md:border-none md:rounded-none",
            )}
            ref={ref}
        >
            <div className="flex-col flex flex-1 h-full text-sm">
                <Header variant={variant as HeaderProps["variant"]} />
                <div
                    className="grow overflow-y-auto pe-3"
                    ref={chatContainerRef}
                >
                    <div
                        ref={messagesContainerRef}
                        className="flex flex-col gap-2 text-sm max-w-3xl mx-auto p-3"
                    >
                        {chat.messages.map((message) => (
                            <Message {...message} key={message.id} />
                        ))}
                        {isLoading && chat.messages.length > 0 && <Loading />}
                    </div>
                </div>
                <Footer
                    variant={variant as FooterProps["variant"]}
                    placeholder={placeholder as FooterProps["placeholder"]}
                />
            </div>
        </div>
    );
};

export default Card;
