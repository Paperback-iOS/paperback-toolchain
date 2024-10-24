import { SearchFilter } from "."

type SearchFilterValues = Pick<SearchFilter, 'id' | 'value'>

export interface SearchQuery {
    title: string
    filters: SearchFilterValues[]
}