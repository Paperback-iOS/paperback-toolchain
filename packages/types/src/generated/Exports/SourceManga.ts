import { MangaInfo } from "./../_exports";
export interface SourceManga {
    /*
    * internalName: mangaId
    */
    id: string;
    mangaInfo: MangaInfo;
}
declare global {
    namespace App {
        function createSourceManga(info: {
            id: string
            mangaInfo: MangaInfo
        }): SourceManga;
    }
}
