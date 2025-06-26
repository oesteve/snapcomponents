import { useEffect } from 'react'
import { useBreadcrumbStore, type BreadcrumbItem } from '@/pages/admin/layout/breadcrumb-store.ts'

/**
 * Hook to set breadcrumbs for a page
 * @param items Array of breadcrumb items to set
 */
export function useBreadcrumb(items: BreadcrumbItem[]) {
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs(items)

    // Clean up breadcrumbs when component unmounts
    return () => {
      // We don't clear breadcrumbs on unmount to prevent flickering
      // when navigating between pages
    }
  }, [items, setBreadcrumbs])
}

/**
 * Hook to get the current breadcrumbs
 * @returns Array of breadcrumb items
 */
export function useBreadcrumbItems() {
  return useBreadcrumbStore((state) => state.items)
}
