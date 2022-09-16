import { PagedResults, SearchField, SearchRequest, TagSection } from "../.."
import { MangaProviding } from "./MangaProviding"

export interface Searchable extends MangaProviding {
    getSearchResults(query: SearchRequest, metadata: unknown | undefined): Promise<PagedResults>
    
    getSearchTags?(): Promise<TagSection[]>
    getSearchFields?(): Promise<SearchField[]>
    
    supportsTagExclusion?(): Promise<boolean>
    supportsSearchOperators?(): Promise<boolean>
}