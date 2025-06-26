import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {type Agent} from "@/lib/agents/agents.ts";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Code, Copy} from "lucide-react";
import {toast} from "sonner";

interface AgentInstallationDialogProps {
    agent: Agent;
    trigger?: React.ReactNode;
}

export function AgentInstallationDialog({agent, trigger}: AgentInstallationDialogProps) {
    const [open, setOpen] = useState(false);

    // Mock installation code snippet
    const installationCode = `
<script src="${agent.url}" async type="module"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installationCode).then(
            () => {
                toast.success("Code copied to clipboard")
            },
            () => {
                toast.error("Failed to copy code to clipboard")
            }
        )
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="outline" size="icon">
                        <Code className="h-4 w-4"/>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Install Agent on Your Website</DialogTitle>
                    <DialogDescription>
                        Follow these instructions to add the agent "{agent.name}" to your website.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-col space-y-8">
                        <h3 className="text-lg font-medium">Step 1: Add the following code to your website</h3>
                        <p className="text-sm text-muted-foreground">
                            Add this code snippet to the <code>&lt;head&gt;</code> section of your HTML.
                        </p>

                        <div className="relative max-w-full sm:max-w-[550px]">
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
                                <Copy/>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Step 2: Customize the widget (optional)</h3>
                        <p className="text-sm text-muted-foreground">
                            You can customize the appearance and behavior of the chat widget by modifying the
                            configuration options.
                        </p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            <li><code>position</code>: Where the widget appears on your page (bottom-right, bottom-left,
                                etc.)
                            </li>
                            <li><code>theme</code>: Set to "dark" or "light" to match your website's design</li>
                            <li><code>initialMessage</code>: A message to show when the chat first opens</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Step 3: Test your integration</h3>
                        <p className="text-sm text-muted-foreground">
                            After adding the code to your website, refresh the page and you should see the chat widget
                            appear.
                            Click on it to open the chat and test if it's working correctly.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
