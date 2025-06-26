import {useQuery} from "@tanstack/react-query";
import type {ColumnDef} from "@tanstack/react-table";
import {type Agent, getAgents} from "@/lib/agents/agents.ts";
import {DataTable} from "@/components/admin/agents/data-table.tsx";
import {CreateAgentDialog} from "@/components/admin/agents/create-agent-dialog.tsx";
import {RemoveAgentDialog} from "@/components/admin/agents/remove-agent-dialog.tsx";
import {EditAgentDialog} from "@/components/admin/agents/edit-agent-dialog.tsx";
import {AgentInstallationDialog} from "@/components/admin/agents/agent-installation-dialog.tsx";


export function AgentList() {

    const agentsQuery = useQuery({
        queryKey: ['agents'],
        queryFn: getAgents
    })


    const columns: ColumnDef<Agent>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <EditAgentDialog
                        agent={agent}
                        onEdited={refresh}
                        trigger={
                            <span className="font-medium hover:underline cursor-pointer">
                                {agent.name}
                            </span>
                        }
                    />
                );
            },
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => {
                const agent = row.original;
                return (
                    <AgentInstallationDialog
                        agent={agent}
                        trigger={
                            <span className="font-medium hover:underline cursor-pointer">
                                {agent.code}
                            </span>
                        }
                    />
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
                        <EditAgentDialog agent={agent} onEdited={refresh} />
                        <RemoveAgentDialog agent={agent} onRemoved={refresh} />
                    </div>
                );
            },
        }
    ]

    function refresh() {
        agentsQuery.refetch()
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-end">
                <CreateAgentDialog onCreated={refresh}/>
            </div>
            <DataTable columns={columns} data={agentsQuery.data ?? []}/>
        </div>
    )
}
