import type { Chapter } from './Chapter.js'
import type { SourceManga } from './SourceManga.js'

export interface MangaProgress {
  sourceManga: SourceManga
  lastReadChapter: Chapter

  lastReadTime?: Date
  userRating?: number
}
