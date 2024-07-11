import { PagedResults, SearchField, SearchQuery, SearchResultItem, TagSection } from "../.."
import { MangaProviding } from "./MangaProviding"

/**
 * @deprecated Use {@link SearchResultsProviding}
 */
export type Searchable = SearchResultsProviding

export interface SearchResultsProviding extends MangaProviding {
    getSearchResults(
        query: SearchQuery,
        metadata: unknown | undefined,
    ): Promise<PagedResults<SearchResultItem>>
}
