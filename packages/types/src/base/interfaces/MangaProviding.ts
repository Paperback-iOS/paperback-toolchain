import { SourceManga } from "../..";
import { RequestManagerProviding } from "./RequestManagerProviding";

export interface MangaProviding extends RequestManagerProviding {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link MangaInfo} object
   * @param mangaId The ID which this function is expected to grab data for
   */
	getMangaDetails(mangaId: string): Promise<SourceManga>

  /**
   * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
   * @param mangaId 
   */
  getMangaShareUrl?(mangaId: string): string
}