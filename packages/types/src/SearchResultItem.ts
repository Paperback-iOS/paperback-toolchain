import { ContentRating } from "./SourceInfo";

export interface SearchResultItem {
  mangaId: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  metadata?: unknown;
  contentRating?: ContentRating;
}
