import React from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ChatContent from './ChatContent';

// Create a client
const queryClient = new QueryClient();

interface ChatComponentProps {
    initialCount?: number;
}

const ChatComponent: React.FC<ChatComponentProps> = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChatContent />
        </QueryClientProvider>
    );
};

export default ChatComponent;
