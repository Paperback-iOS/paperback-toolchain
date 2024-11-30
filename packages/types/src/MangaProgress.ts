import { SourceManga } from "./SourceManga";

export interface MangaProgress {
  sourceManga: SourceManga;
  trackedListName: string;
  lastReadChapterNumber: number;
  lastReadVolumeNumber?: number;
  lastReadTime?: Date;
  userRating?: number;
}
