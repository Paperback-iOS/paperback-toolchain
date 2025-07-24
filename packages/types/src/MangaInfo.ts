import type { ContentRating } from './impl/SourceInfo.js'
import type { TagSection } from './TagSection.js'

export interface MangaInfo {
  thumbnailUrl: string
  synopsis: string
  primaryTitle: string
  secondaryTitles: string[]
  contentRating: ContentRating

  status?: string
  artist?: string
  author?: string
  bannerUrl?: string
  rating?: number
  tagGroups?: TagSection[]
  artworkUrls?: string[]
  additionalInfo?: Record<string, string>

  shareUrl?: string
}
