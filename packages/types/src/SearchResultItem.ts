import type { ContentRating } from './impl/SourceInfo.js'

export interface SearchResultItem {
  mangaId: string
  title: string
  subtitle?: string
  imageUrl: string
  metadata?: unknown
  contentRating?: ContentRating
}
