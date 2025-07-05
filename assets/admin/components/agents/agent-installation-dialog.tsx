import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { type Agent } from "@/lib/agents/agents.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Code } from "lucide-react";
import { AgentInstall } from "@/admin/components/agents/agent-install.tsx";

interface AgentInstallationDialogProps {
    agent: Agent;
    trigger?: React.ReactNode;
}

export function AgentInstallationDialog({
    agent,
    trigger,
}: AgentInstallationDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="outline" size="icon">
                        <Code className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Install Agent on Your Website</DialogTitle>
                    <DialogDescription>
                        Follow these instructions to add the agent "{agent.name}
                        " to your website.
                    </DialogDescription>
                </DialogHeader>
                <AgentInstall agent={agent} />
                <div className="flex justify-end space-x-2 pt-4">
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
