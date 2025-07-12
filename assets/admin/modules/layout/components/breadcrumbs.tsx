import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link } from "@tanstack/react-router";
import React from "react";
import { useBreadcrumbs } from "@/admin/modules/layout/hooks/breacrumbs.tsx";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}
export function Breadcrumbs() {
    const breadcrumbItems = useBreadcrumbs();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem
                            className={index === 0 ? "hidden md:block" : ""}
                        >
                            {item.isActive ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href || "#"}>
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
