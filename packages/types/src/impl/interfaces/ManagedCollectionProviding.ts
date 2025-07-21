import type { SourceManga } from '../../SourceManga.js'

export interface ManagedCollectionProviding {
  getManagedLibraryCollections(): Promise<ManagedCollection[]>

  commitManagedCollectionChanges(
    changeset: ManagedCollectionChangeset
  ): Promise<void>

  getSourceMangaInManagedCollection(
    managedCollection: ManagedCollection
  ): Promise<SourceManga[]>
}

export interface PartialLibraryItem {
  id: string
  primarySource: SourceManga
  secondarySources: SourceManga[]
  trackedSources: SourceManga[]
}

export interface LibraryItemSourceLinkProposal {
  sourceManga: SourceManga
  libraryItem: PartialLibraryItem
}

export interface ManagedCollection {
  id: string
  title: string
}

export interface ManagedCollectionChangeset {
  collection: ManagedCollection

  additions: SourceManga[]
  deletions: SourceManga[]
}
