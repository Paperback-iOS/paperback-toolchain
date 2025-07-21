import type { SourceManga } from './SourceManga.js'

export interface Chapter {
  chapterId: string
  sourceManga: SourceManga
  langCode: string
  chapNum: number
  title?: string
  version?: string
  volume?: number
  additionalInfo?: Record<string, string>
  publishDate?: Date
  creationDate?: Date
  sortingIndex?: number
}
