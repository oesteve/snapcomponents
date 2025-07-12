import { useRouteContext } from "@tanstack/react-router";

export function useCurrentAgent() {
    return useRouteContext({
        from: "/admin",
        select: (context) => context.agent,
    });
}
