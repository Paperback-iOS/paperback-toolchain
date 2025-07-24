import type { PagedResults } from '../../PagedResults.js'
import type { SearchFilter } from '../../SearchFilter.js'
import type { SearchQuery } from '../../SearchQuery.js'
import type { SearchResultItem } from '../../SearchResultItem.js'
import type { SortingOption } from '../../SortingOption.js'
import { hasPropertiesOf } from './index.js'
import type { MangaProviding } from './MangaProviding.js'

/**
 * @deprecated Use {@link SearchResultsProviding}
 */
export type Searchable = SearchResultsProviding

export interface SearchResultsProviding extends MangaProviding {
  getSearchFilters(): Promise<SearchFilter[]>

  getSearchResults(
    query: SearchQuery,
    metadata: unknown | undefined,
    sortingOption: SortingOption | undefined
  ): Promise<PagedResults<SearchResultItem>>

  getSortingOptions?(query: SearchQuery): Promise<SortingOption[]>
}

export function implementsSearchResultsProviding(
  extension: MangaProviding
): extension is SearchResultsProviding {
  return hasPropertiesOf<SearchResultsProviding>(
    ['getSearchFilters', 'getSearchResults'],
    extension
  )
}
