import { MangaInfo } from "./../_exports";
export interface TrackedManga {
    /*
    * internalName: mangaId
    */
    id: string;
    mangaInfo: MangaInfo;
}
declare global {
    namespace App {
        function createTrackedManga(info: {
            mangaId: string
            mangaInfo: MangaInfo
        }): TrackedManga;
    }
}
