import { SourceManga } from "../..";
import { Requestable } from "./Requestable";

export interface MangaProviding extends Requestable {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link MangaInfo} object
   * @param mangaId The ID which this function is expected to grab data for
   */
	getMangaDetails(mangaId: string): Promise<SourceManga>
}