import { PagedResults, SearchField, SearchRequest, TagSection } from ".."
import { Requestable } from "./Requestable"

export interface Searchable extends Requestable {
    getSearchResults(query: SearchRequest, metadata: unknown | undefined): Promise<PagedResults>
    
    getSearchTags?(): Promise<TagSection[]>
    getSearchFields?(): Promise<SearchField[]>
    
    supportsTagExclusion?(): Promise<boolean>
    supportsSearchOperators?(): Promise<boolean>
}