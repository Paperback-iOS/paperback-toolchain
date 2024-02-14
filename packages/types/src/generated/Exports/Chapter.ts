import { SourceManga } from "./SourceManga"

export interface Chapter {
    chapterId: string
    sourceManga: SourceManga
    langCode: string
    chapNum: number
    title?: string
    volume?: number
    subtitle?: string
    publishDate?: Date
    sortingIndex?: number
    metadata?: unknown
}