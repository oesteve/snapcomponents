import client from "@/lib/client.ts";

export type Agent = {
    id: number;
    name: string;
    code: string;
    url: string;
};

export function getAgents() {
    return client.get<Agent[]>("/api/agents");
}

export type AgentData = {
    name: string;
};

export function createAgent(agent: AgentData) {
    return client.post<Agent>("/api/agents", agent);
}

export function removeAgent(id: Agent["id"]) {
    return client.delete<Agent>(`/api/agents/${id}`);
}

export function updateAgent({
    id,
    name,
}: {
    id: Agent["id"];
    name: Agent["name"];
}) {
    return client.put<Agent>(`/api/agents/${id}`, { name });
}

export function getAgent(id: Agent["id"]) {
    return client.get<Agent>(`/api/agents/${id}`);
}
