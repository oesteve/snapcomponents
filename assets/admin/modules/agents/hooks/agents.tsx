import { useQuery } from "@tanstack/react-query";
import { getAgents } from "@/lib/agents/agents";

export function useAgents() {
    return useQuery({
        queryKey: ["agents"],
        queryFn: getAgents,
    });
}
