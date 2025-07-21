import React, { type MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, ChevronsDownUp, ChevronsDown } from "lucide-react";
import { useChatStoreBase } from "@/widgets/chat/store/useChatStore";
import { OptionsMenu } from "@/widgets/chat/components/OptionsMenu";

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

export type HeaderProps = VariantProps<typeof headerVariants>;

const Header: React.FC<HeaderProps> = ({ variant }) => {
    const closeChat = useChatStoreBase((state) => state.closeChat);
    const toggleExpanded = useChatStoreBase((state) => state.toggleExpanded);
    const chat = useChatStoreBase((state) => state.chat);
    const isExpanded = useChatStoreBase((state) => state.isExpanded);

    const handleClose = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        closeChat();
    };

    const handleToggleExpanded = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleExpanded();
    };

    return (
        <div className={cn(headerVariants({ variant }))}>
            <h2 className="text-2xl font-medium px-2">
                {chat!.configuration.name ?? ""}
            </h2>
            <div className="flex gap-2 ms-auto">
                <div className="flex flex-row">
                    <Button
                        className="hidden md:inline-flex -rotate-45 rounded-full"
                        size="icon"
                        variant="ghost"
                        onClick={handleToggleExpanded}
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronsDownUp /> : <ChevronsUpDown />}
                    </Button>
                    <Button
                        className="rounded-full"
                        size="icon"
                        variant="ghost"
                        onClick={handleClose}
                        title="Minimize"
                    >
                        <ChevronsDown />
                    </Button>
                    <OptionsMenu />
                </div>
            </div>
        </div>
    );
};

export default Header;
