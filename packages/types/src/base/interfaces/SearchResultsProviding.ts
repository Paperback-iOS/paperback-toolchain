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

    getSearchTags?(): Promise<TagSection[]>
    getSearchFields?(): Promise<SearchField[]>

    supportsTagExclusion?(): Promise<boolean>
    supportsSearchOperators?(): Promise<boolean>
}
