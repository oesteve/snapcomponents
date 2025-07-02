import {type Agent, getAgent} from "@/lib/agents/agents.ts";
import {useQuery} from "@tanstack/react-query";


export function useAgent(id: Agent['id']) {
    return useQuery({
        queryFn: () => getAgent(id),
        queryKey: ['agent', id],
    })
}
