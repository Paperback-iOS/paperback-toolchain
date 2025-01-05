import { Chapter } from "./Chapter";
import { ManagedCollection } from "./impl/interfaces/ManagedCollectionProviding"
import { SourceManga } from "./SourceManga";

export interface MangaProgress {
  sourceManga: SourceManga;
  lastReadChapter: Chapter;

  lastReadTime?: Date;
  userRating?: number;
}
