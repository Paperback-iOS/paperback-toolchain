import type { PagedResults } from '../../PagedResults.js'
import type { SearchFilter } from '../../SearchFilter.js'
import type { SearchQuery } from '../../SearchQuery.js'
import type { SearchResultItem } from '../../SearchResultItem.js'
import type { SortingOption } from '../../SortingOption.js'
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
