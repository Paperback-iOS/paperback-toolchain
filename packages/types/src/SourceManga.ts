import type { MangaInfo } from './MangaInfo.js'

export interface SourceManga {
  mangaId: string
  mangaInfo: MangaInfo

  /**
   * These are internal properties, they might be available in some situations
   * However, the app ignores any changes made by the source.
   *
   * These are updated and tracked by the database.
   */
  readonly chapterCount?: number
  readonly newChapterCount?: number
  readonly unreadChapterCount?: number
}
