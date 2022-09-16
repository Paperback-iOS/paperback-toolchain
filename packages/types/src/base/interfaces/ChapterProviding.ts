import { Chapter, ChapterDetails } from "../..";
import { MangaProviding } from "./MangaProviding";

export interface ChapterProviding extends MangaProviding {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link Chapter} array.
   * @param mangaId The ID which this function is expected to grab data for
   */
	 getChapters(mangaId: string): Promise<Chapter[]>

	 /**
	 * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
	 * to grab and populate a {@link ChapterDetails} object
	 * @param mangaId The ID which this function is expected to grab data for
	 */
	 getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails>
}