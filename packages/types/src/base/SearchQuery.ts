import { SearchFilter } from "."

export interface SearchQuery {
    title: string
    filters: SearchFilter[]
}