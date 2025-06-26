import { create } from 'zustand'

// Define the type for a breadcrumb item
export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

// Define the type for the breadcrumb store state
interface BreadcrumbState {
  items: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  addBreadcrumb: (item: BreadcrumbItem) => void
  clearBreadcrumbs: () => void
}

// Create the breadcrumb store
export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setBreadcrumbs: (items) => set({ items }),
  addBreadcrumb: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  clearBreadcrumbs: () => set({ items: [] }),
}))
