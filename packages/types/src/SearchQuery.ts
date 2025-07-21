import type { SearchFilter } from './SearchFilter.js'

type SearchFilterValues = Pick<SearchFilter, 'id' | 'value'>

export interface SearchQuery {
  title: string
  filters: SearchFilterValues[]
}
