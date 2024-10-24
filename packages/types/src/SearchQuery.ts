import type { SearchFilter } from "./SearchFilter"

type SearchFilterValues = Pick<SearchFilter, "id" | "value">;

export interface SearchQuery {
  title: string;
  filters: SearchFilterValues[];
}
