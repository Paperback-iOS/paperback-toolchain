import type { SourceManga } from '../../SourceManga.js'

export interface MangaProviding {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link MangaInfo} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  getMangaDetails(mangaId: string): Promise<SourceManga>
}
