import type { Metadata } from './Metadata.js'

export type SearchQuery<SearchQueryMetadata extends Metadata> = {
  title: string
  metadata?: SearchQueryMetadata
}
