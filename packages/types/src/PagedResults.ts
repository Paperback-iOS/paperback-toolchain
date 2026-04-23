import type { Metadata } from "./Metadata.js"

export interface PagedResults<T> {
  items: T[]
  /// Set this to undefined to tell the app that there are no more items
  metadata?: Metadata
}

export const EndOfPageResults: PagedResults<never> = Object.freeze({
  items: [],
  metadata: undefined,
})
