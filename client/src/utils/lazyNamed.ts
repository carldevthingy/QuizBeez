import { lazy } from 'react'
import type { ComponentType } from 'react'

/**
 * helper to lazy-load named exports
 */
export const lazyNamed = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  importFunc: () => Promise<T>,
  exportName: K
) => {
  return lazy(() =>
    importFunc().then((module) => ({
      default: module[exportName] as unknown as ComponentType<unknown>,
    }))
  )
}