import { Button } from "@/components/ui/button.tsx";
import type { Agent } from "@/lib/agents/agents.ts";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface InstallAgentProps {
    agent: Agent;
}

export function AgentInstall({ agent }: InstallAgentProps) {
    // Mock installation code snippet
    const installationCode = `
<script src="${agent.url}" async type="module"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installationCode).then(
            () => {
                toast.success("Code copied to clipboard");
            },
            () => {
                toast.error("Failed to copy code to clipboard");
            },
        );
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-base mb-2">
                    Step 1: Add the following code to your website
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Add this code snippet to the <code>&lt;head&gt;</code>{" "}
                    section of your HTML.
                </p>
                <div className="relative max-w-full w-full">
                    <div className="bg-secondary p-4 pt-14 rounded-md overflow-x-auto">
                        <div>
                            <pre className="text-sm whitespace-nowrap">
                                {installationCode}
                            </pre>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={copyToClipboard}
                    >
                        <Copy />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-base mb-2">
                    Step 2: Customize the widget (optional)
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can customize the appearance and behavior of the chat
                    widget by modifying the configuration options.
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>
                        <code>position</code>: Where the widget appears on your
                        page (bottom-right, bottom-left, etc.)
                    </li>
                    <li>
                        <code>theme</code>: Set to "dark" or "light" to match
                        your website's design
                    </li>
                    <li>
                        <code>initialMessage</code>: A message to show when the
                        chat first opens
                    </li>
                </ul>
            </div>
            <div className="space-y-2">
                <h3 className="text-base mb-2">
                    Step 3: Test your integration
                </h3>
                <p className="text-sm text-muted-foreground">
                    After adding the code to your website, refresh the page and
                    you should see the chat widget appear. Click on it to open
                    the chat and test if it's working correctly.
                </p>
            </div>
        </div>
    );
}
