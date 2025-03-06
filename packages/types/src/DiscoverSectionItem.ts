import type { SearchQuery } from "./SearchQuery"

export interface FeaturedCarouselItem {
  type: "featuredCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  supertitle?: string;
  metadata?: unknown;
}

export interface SimpleCarouselItem {
  type: "simpleCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  metadata?: unknown;
}

export interface ProminentCarouselItem {
  type: "prominentCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  metadata?: unknown;
}

export interface ChapterUpdatesCarouselItem {
  type: "chapterUpdatesCarouselItem";
  mangaId: string;
  chapterId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  publishDate?: Date;
  metadata?: unknown;
}

export interface GenresCarouselItem {
  type: "genresCarouselItem";
  searchQuery: SearchQuery;
  name: string;
  metadata?: unknown;
}

export type DiscoverSectionItem =
  | FeaturedCarouselItem
  | SimpleCarouselItem
  | ProminentCarouselItem
  | ChapterUpdatesCarouselItem
  | GenresCarouselItem;
