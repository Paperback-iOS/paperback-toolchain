import type { Request } from "./Request.js"

type ChapterDetailsInfo = {
  id: string
  mangaId: string
}

type ImageChapter = ChapterDetailsInfo & {
  // This is optional for compatibility's sake
  type?: 'images'
  pages: string[]
}

type NovelChapter = ChapterDetailsInfo & {
  type: 'html'
  html: string
}

type FileChapter = ChapterDetailsInfo & {
  type: 'file'
  format: 'epub' | 'pdf' | 'cbz'
  request: Request
}

export type ChapterDetails = ImageChapter | NovelChapter | FileChapter