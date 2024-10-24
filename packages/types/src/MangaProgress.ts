export interface MangaProgress {
  sourceId: string;
  mangaId: string;
  lastReadChapterNumber: number;
  /*
   * internalName: _lastReadVolumeNumber
   */
  lastReadVolumeNumber?: number;
  trackedListName?: string;
  lastReadTime?: Date;
  /*
   * internalName: _userRating
   */
  userRating?: number;
}
