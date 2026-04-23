import type { Metadata } from './Metadata.js'
import type { SearchQuery } from './SearchQuery.js'
import type { ContentRating } from './impl/SourceInfo.js'

export interface FeaturedCarouselItem {
  type: 'featuredCarouselItem'
  mangaId: string
  imageUrl: string
  title: string
  supertitle?: string
  metadata?: Metadata
  contentRating?: ContentRating
}

export interface SimpleCarouselItem {
  type: 'simpleCarouselItem'
  mangaId: string
  imageUrl: string
  title: string
  subtitle?: string
  metadata?: Metadata
  contentRating?: ContentRating
}

export interface ProminentCarouselItem {
  type: 'prominentCarouselItem'
  mangaId: string
  imageUrl: string
  title: string
  subtitle?: string
  metadata?: Metadata
  contentRating?: ContentRating
}

export interface ChapterUpdatesCarouselItem {
  type: 'chapterUpdatesCarouselItem'
  mangaId: string
  chapterId: string
  imageUrl: string
  title: string
  subtitle?: string
  publishDate?: Date
  metadata?: Metadata
  contentRating?: ContentRating
}

export interface GenresCarouselItem {
  type: 'genresCarouselItem'
  searchQuery: SearchQuery
  name: string
  metadata?: Metadata
  contentRating?: ContentRating
}

export type DiscoverSectionItem =
  | FeaturedCarouselItem
  | SimpleCarouselItem
  | ProminentCarouselItem
  | ChapterUpdatesCarouselItem
  | GenresCarouselItem
