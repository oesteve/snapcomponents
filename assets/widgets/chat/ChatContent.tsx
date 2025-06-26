import React, {useState} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {MessageCircle} from "lucide-react";
import ChatCard from './ChatCard';


const ChatContent: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {!open
                ? (<Button onClick={() => setOpen(true)} variant="outline" size="icon" className="size-16 rounded-full shadow-lg">
                    <MessageCircle className="size-8" />
                </Button>)
                : (
                    <ChatCard
                        onClose={() => setOpen(false)}
                    />
                )
            }
        </>
    );
};

export default ChatContent;
