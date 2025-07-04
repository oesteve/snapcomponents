import { useEffect } from 'react'
import { useLayoutStore, type BreadcrumbItem } from '@/admin/components/layout/breadcrumb-store.ts'

/**
 * Hook to set breadcrumbs for a page
 * @param items Array of breadcrumb items to set
 */
export function useBreadcrumb(items: BreadcrumbItem[]) {
  const setBreadcrumbs = useLayoutStore((state) => state.setBreadcrumbs)

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
  return useLayoutStore((state) => state.breadcrumbItems)
}
