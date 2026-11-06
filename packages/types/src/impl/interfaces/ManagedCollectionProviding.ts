import type { SourceManga } from '../../SourceManga.js'

export interface ManagedCollectionProviding {
  getManagedCollections(): Promise<ManagedCollection[]>

  /**
   * The current contents of each requested collection, in one call, so a
   * tracker can fetch its library once and split it by collection.
   */
  getManagedCollectionItems(
    collections: ManagedCollection[]
  ): Promise<ManagedCollectionItems[]>

  /**
   * Applies every change the user approved for this extension. Return the
   * changes that failed; throw only when none of them were applied.
   */
  applyManagedCollectionChanges(
    changes: ManagedCollectionChange[]
  ): Promise<ManagedCollectionChangeFailure[]>
}

export interface ManagedCollection {
  id: string
  title: string

  /**
   * Collections with the same group are mutually exclusive: a title is in at
   * most one of them. An `add` or `move` into one of them takes the title out
   * of the others and keeps its data.
   */
  exclusiveGroup?: string
}

export interface ManagedCollectionItems {
  collectionId: string
  items: SourceManga[]
}

export type ManagedCollectionChange =
  | {
      id: string
      type: 'add'
      to: ManagedCollection
      sourceManga: SourceManga
    }
  | {
      id: string
      type: 'remove'
      from: ManagedCollection
      sourceManga: SourceManga
    }
  | {
      id: string
      type: 'move'
      from: ManagedCollection
      to: ManagedCollection
      sourceManga: SourceManga
    }

export interface ManagedCollectionChangeFailure {
  /** The `id` of the change that failed. */
  changeId: string
  reason: string
}
