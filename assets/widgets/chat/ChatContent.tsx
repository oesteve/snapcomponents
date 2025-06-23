import React, {useState} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {MessageCircle, X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useMutation} from "@tanstack/react-query";
import {type Chat, createChat, sendMessage} from "@/widgets/chat/lib/chat.ts";


const ChatContent: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<Chat>();

    const createChatMutation = useMutation({
        mutationFn: createChat,
        onSuccess: (chat) => {
            setChat(chat);
            setMessage('');
        },
        onError: (error) => {
            console.error('Error sending message:', error);
        }
    })

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: (chat) => {
            setChat(chat);
            setMessage('');
        },
        onError: (error) => {
            console.error('Error sending message:', error);
        }
    })

    const handleSendMessage = () => {
        if (!message.trim()) {
            return;
        }

        if (!chat) {
            createChatMutation.mutate({
                content: message
            });
            return;
        }

        sendMessageMutation.mutate({
            chatId: chat.id,
            content: message
        })
    };

    return (
        <>
            {!open
                ? (<Button onClick={() => setOpen(true)} variant="outline" size="icon" className="size-16 rounded-full shadow-lg">
                    <MessageCircle className="size-8" />
                </Button>)
                : (
                    <div className="h-[600px] border border-border rounded-2xl relative w-[500px] shadow-lg">
                        <Button size="icon" variant="ghost" className="absolute top-2 right-2"
                                onClick={() => setOpen(false)}>
                            <X/>
                        </Button>

                        <div className="p-4 flex-col gap-4 flex flex-1 h-full">
                            <h2 className="text-2xl font-medium mb-4">Chat Widget</h2>
                            <div className="grow overflow-y-auto">
                                {chat?.messages.map(({content}, index) => (
                                    <p key={index}>
                                        {content}
                                    </p>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    loading={createChatMutation.isPending}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ChatContent;
