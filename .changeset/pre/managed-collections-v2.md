---
'@paperback/types': patch
---

- `getManagedCollections()` replaces `getManagedLibraryCollections()`.
- `getManagedCollectionItems(collections)` replaces `getSourceMangaInManagedCollection(collection)`, fetching every collection in one call.
- `applyManagedCollectionChanges(changes)` replaces `commitManagedCollectionChanges(changeset)`. Each change is an `add`, `remove` or `move` with an `id`; return the ones that failed.
- `ManagedCollection.exclusiveGroup` marks collections a title can only be in one of at a time.
- `PartialLibraryItem`, `LibraryItemSourceLinkProposal` and `ManagedCollectionChangeset` are removed.