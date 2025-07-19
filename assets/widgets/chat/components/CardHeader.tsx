import React, { type MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minimize2, Plus } from "lucide-react";
import { useChat } from "@/widgets/chat/hooks/useChat";

const headerVariants = cva("flex p-3", {
    variants: {
        variant: {
            flat: "border-b bg-muted",
            default: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export type CardHeaderProps = VariantProps<typeof headerVariants> & {
    onClose: () => void;
};

const CardHeader: React.FC<CardHeaderProps> = ({ variant, onClose }) => {
    const { chat, createChat } = useChat();
    const handleNewChat = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createChat();
    };

    const handleClose = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    return (
        <div className={cn(headerVariants({ variant }))}>
            <h2 className="text-2xl font-medium px-2">
                {chat!.configuration.name ?? ""}
            </h2>
            <div className="flex gap-2 ms-auto">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleNewChat}
                    title="New Chat"
                >
                    <Plus />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClose}
                    title="Minimize"
                >
                    <Minimize2 />
                </Button>
            </div>
        </div>
    );
};

export default CardHeader;
