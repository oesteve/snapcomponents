import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

interface ChatMessageProps {
    content: string;
    role: string;
}

type ToolMessageContent = {
    tool: string;
    parameters: Record<string, any>;
    result: any;
};

// Tool message component
function ToolMessage({ content }: { content: string }) {
    const toolMessage = JSON.parse(content) as ToolMessageContent;
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="border rounded-lg p-1 ps-3 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <span className="font-medium">Tool:</span>
                    <span className="mx-2">{toolMessage.tool}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <ChevronDownIcon
                        className={`size-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                    />
                </Button>
            </div>

            {showDetails && (
                <div className="max-w-full overflow-x-auto mt-2 bg-secondary/50 p-2 rounded-lg">
                    <pre>{JSON.stringify(toolMessage, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

// Assistant message component
function AssistantMessage({ content }: { content: string }) {
    // prevent interpretation as MD Quote
    const processedContent = content.replace(/"\n+>/g, '">');

    return (
        <div className="prose">
            <Markdown
                skipHtml={false}
                rehypePlugins={[rehypeRaw]}
                disallowedElements={["blockquote"]}
            >
                {processedContent}
            </Markdown>
        </div>
    );
}

// User message component
function UserMessage({ content }: { content: string }) {
    return (
        <p className="bg-primary text-background p-2 px-4 rounded-lg self-end">
            {content}
        </p>
    );
}

// Main message component that delegates to role-specific components
export function Message({ content, role }: ChatMessageProps) {
    if (role === "tool") {
        return <ToolMessage content={content} />;
    }

    if (role === "assistant") {
        return <AssistantMessage content={content} />;
    }

    return <UserMessage content={content} />;
}
