import { PagedResults, SearchField, SearchRequest, TagSection } from "../.."
import { MangaProviding } from "./MangaProviding"

/**
* @deprecated Use {@link SearchResultsProviding}
*/
export type Searchable = SearchResultsProviding

export interface SearchResultsProviding extends MangaProviding {
    getSearchResults(query: SearchRequest, metadata: unknown | undefined): Promise<PagedResults>
    
    getSearchTags?(): Promise<TagSection[]>
    getSearchFields?(): Promise<SearchField[]>
    
    supportsTagExclusion?(): Promise<boolean>
    supportsSearchOperators?(): Promise<boolean>
}