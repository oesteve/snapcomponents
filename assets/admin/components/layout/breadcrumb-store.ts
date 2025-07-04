import {create} from 'zustand'
import type {Agent} from "@/lib/agents/agents.ts";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";

// Define the type for a breadcrumb item
export interface BreadcrumbItem {
    label: string
    href?: string
    isActive?: boolean
}

// Define the type for the breadcrumb store state
interface BreadcrumbState {
    breadcrumbItems: BreadcrumbItem[]
    agent: Agent | null
    setAgent: (agent: Agent | null) => void
    setBreadcrumbs: (items: BreadcrumbItem[]) => void
    addBreadcrumb: (item: BreadcrumbItem) => void
    clearBreadcrumbs: () => void
}

// Create the breadcrumb store
export const useLayoutStore = create<BreadcrumbState>((set) => ({
    breadcrumbItems: [],
    agent: null,
    setAgent: (agent) => set({agent}),
    setBreadcrumbs: (items) => set({breadcrumbItems: items}),
    addBreadcrumb: (item) => set((state) => ({
        breadcrumbItems: [...state.breadcrumbItems, item]
    })),
    clearBreadcrumbs: () => set({breadcrumbItems: []}),
}))


export function useLayoutAgent() {
    return useStoreWithEqualityFn(useLayoutStore, (state) => ({
        agent: state.agent,
        setAgent: state.setAgent,
    }), shallow)
}
