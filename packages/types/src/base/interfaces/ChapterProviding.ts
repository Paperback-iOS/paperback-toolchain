import { Chapter, ChapterDetails, SourceManga } from "../.."
import { MangaProviding } from "./MangaProviding"

export interface ChapterProviding extends MangaProviding {
	/**
	 * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
	 * to grab and populate a {@link Chapter} array.
	 * @param mangaId The ID which this function is expected to grab data for
	 */
	getChapters(sourceManga: SourceManga): Promise<Chapter[]>

	/**
	 * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
	 * to grab and populate a {@link ChapterDetails} object
	 * @param mangaId The ID which this function is expected to grab data for
	 */
	getChapterDetails(chapter: Chapter): Promise<ChapterDetails>
}
