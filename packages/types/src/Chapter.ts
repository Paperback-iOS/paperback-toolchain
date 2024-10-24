import { SourceManga } from "./SourceManga"

export interface Chapter {
  chapterId: string;
  sourceManga: SourceManga;
  langCode: string;
  chapNum: number;
  title?: string;
  version?: string;
  volume?: number;
  metadata?: string;
  publishDate?: Date;
  creationDate?: Date;
  sortingIndex?: number;
}
