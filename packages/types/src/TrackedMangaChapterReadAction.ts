import { Chapter } from "./Chapter";
import { SourceManga } from "./SourceManga";

export interface TrackedMangaChapterReadAction {
  readonly sourceManga: SourceManga;
  readonly readChapter: Chapter;
  readonly readTime: Date;
  readonly errorCount: number;
  readonly lastErrorDate?: Date;
}
