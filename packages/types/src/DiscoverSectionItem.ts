import type { SearchQuery } from "./SearchQuery"

interface FeaturedCarouselItem {
  type: "featuredCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  supertitle?: string;
  metadata?: unknown;
}

interface SimpleCarouselItem {
  type: "simpleCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  metadata?: unknown;
}

interface ProminentCarouselItem {
  type: "prominentCarouselItem";
  mangaId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  metadata?: unknown;
}

interface ChapterUpdatesCarouselItem {
  type: "chapterUpdatesCarouselItem";
  mangaId: string;
  chapterId: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  publishDate?: Date;
  metadata?: unknown;
}

interface GenresCarouselItem {
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
