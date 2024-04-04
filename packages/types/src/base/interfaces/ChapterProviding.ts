import { Chapter, ChapterDetails, SourceManga } from "../.."
import { MangaProviding } from "./MangaProviding"

export interface ChapterProviding extends MangaProviding {
    /**
     * @param sourceManga The sourceManga for which the chapters should be fetched
     */
    getChapters(sourceManga: SourceManga): Promise<Chapter[]>

    /**
     * @param chapter The chapter listing for which the details should be fetched
     */
    getChapterDetails(chapter: Chapter): Promise<ChapterDetails>
}
