import type { PagedResults } from "../../PagedResults"
import type { SearchQuery } from "../../SearchQuery"
import type { SearchResultItem } from "../../SearchResultItem"
import type { MangaProviding } from "./MangaProviding"

/**
 * @deprecated Use {@link SearchResultsProviding}
 */
export type Searchable = SearchResultsProviding;

export interface SearchResultsProviding extends MangaProviding {
  getSearchResults(
    query: SearchQuery,
    metadata: unknown | undefined,
  ): Promise<PagedResults<SearchResultItem>>;
}
