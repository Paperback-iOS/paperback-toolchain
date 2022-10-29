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
declare global {
    namespace App {
        function createMangaProgress(info: {
            mangaId: string
            lastReadChapterNumber: number
            lastReadVolumeNumber?: number
            trackedListName?: string
            lastReadTime?: Date
            userRating?: number
        }): MangaProgress;
    }
}
