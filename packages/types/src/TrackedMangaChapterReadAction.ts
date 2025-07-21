import type { Chapter } from './Chapter.js'
import type { SourceManga } from './SourceManga.js'

export interface TrackedMangaChapterReadAction {
  // Internal object id
  readonly id: string

  // The target source manga
  readonly sourceManga: SourceManga

  // The the originating chapter along with the sourceManga
  readonly readChapter?: Chapter

  // Incase the readChapter gets deleted
  readonly chapterId: string
  readonly chapterSourceId: string
  readonly chapterMangaId: string
  readonly chapterNum: number
  readonly chapterVolume?: number

  // The date at which this action was created, i.e chapter read date
  readonly creationDate: Date

  readonly errorCount: number
  readonly lastErrorDate?: Date
}
