import { useRouterState } from "@tanstack/react-router";
import type { BreadcrumbItem } from "@/admin/modules/layout/components/breadcrumbs.tsx";

export function useBreadcrumbs(): BreadcrumbItem[] {
    const matches = useRouterState({ select: (s) => s.matches }).filter(
        (match) => !!match.context.title,
    );

    return matches.map(({ pathname, context }, idx): BreadcrumbItem => {
        console.log("breadcrumb", pathname, context);
        return {
            label: context.title!,
            href: pathname,
            isActive: idx === matches.length - 1,
        };
    });
}
