import React, {useState, useRef, useEffect} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {type Chat, createChat, sendMessage} from "@/widgets/chat/lib/chat.ts";
import {useMutation} from "@tanstack/react-query";
import Markdown from "react-markdown";
import ProductCard from "@/widgets/product-card/ProductCard.tsx";
import rehypeRaw from "rehype-raw";

interface ChatCardProps {
    onClose: () => void;
}


const ChatCard: React.FC<ChatCardProps> = ({
                                               onClose
                                           }) => {
    const [chat, setChat] = useState<Chat>();
    const [message, setMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chat?.messages]);

    const createChatMutation = useMutation({
        mutationFn: createChat,
        onSuccess: (chat) => {
            setChat(chat);
            setMessage('');
        },
        onError: (error) => {
            console.error('Error creating chat:', error);
        }
    });

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: (chat) => {
            setChat(chat);
        },
        onError: (error) => {
            console.error('Error sending message:', error);
        }
    });

    const handleSendMessage = () => {
        if (!message.trim()) {
            return;
        }

        setMessage('');

        if (!chat) {
            setChat({
                id: 0,
                messages: [{
                    id: 0,
                    content: message,
                    role: 'user'
                }]
            })

            createChatMutation.mutate({
                content: message
            });
            return;
        }

        sendMessageMutation.mutate({
            chatId: chat.id,
            content: message
        });

        setChat((chat) => ({
            ...chat!,
            messages: [
                ...chat!.messages,
                {
                    id: chat!.messages.length,
                    content: message,
                    role: 'user'
                }
            ]
        }))
    };

    const isLoading = createChatMutation.isPending || sendMessageMutation.isPending;

    return (
        <div className="h-[600px] border border-border rounded-2xl relative w-[500px] shadow-lg bg-background">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2"
                    onClick={onClose}>
                <X/>
            </Button>

            <div className="p-4 flex-col gap-4 flex flex-1 h-full">
                <h2 className="text-2xl font-medium mb-4">Chat Widget</h2>
                <div ref={messagesContainerRef} className="grow overflow-y-auto flex flex-col gap-6 text-sm">
                    {chat?.messages.map(({content, role}, index) => {

                        if (role === 'assistant'){

                            console.log(content)

                            return <div className="prose">
                                <Markdown
                                    skipHtml={false}
                                    rehypePlugins={[rehypeRaw]}
                                >{content}</Markdown>
                            </div>
                        }

                        return (
                            <p key={index} className="bg-primary text-background p-2 px-4 rounded-lg self-end">
                                {content}
                            </p>
                        );
                    })}
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
                        loading={isLoading}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatCard;
