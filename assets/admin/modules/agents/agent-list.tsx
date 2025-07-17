import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { type Agent, getAgents } from "@/lib/agents/agents.ts";
import { DataTable } from "@/admin/modules/agents/data-table.tsx";
import { CreateAgentDialog } from "@/admin/modules/agents/create-agent-dialog.tsx";
import { RemoveAgentDialog } from "@/admin/modules/agents/remove-agent-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";

export function useAgents() {
    return useQuery({
        queryKey: ["agents"],
        queryFn: getAgents,
    });
}

export function AgentList() {
    const agentsQuery = useAgents();

    const columns: ColumnDef<Agent>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <Button asChild variant="link">
                        <Link
                            to={`/admin/agents/$agentId`}
                            params={{ agentId: agent.id.toString() }}
                        >
                            {agent.name}
                        </Link>
                    </Button>
                );
            },
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <Link
                        to="/admin/agents/$agentId/install"
                        params={{ agentId: agent.id.toString() }}
                        className="flex items-center gap-2"
                    >
                        <span className="font-medium hover:underline cursor-pointer font-mono">
                            {agent.code}
                        </span>
                    </Link>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <div className="flex justify-end space-x-2">
                        <RemoveAgentDialog agent={agent} onRemoved={refresh} />
                    </div>
                );
            },
        },
    ];

    function refresh() {
        agentsQuery.refetch();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-end">
                <CreateAgentDialog onCreated={refresh} />
            </div>
            <DataTable columns={columns} data={agentsQuery.data ?? []} />
        </div>
    );
}
