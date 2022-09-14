import { Manga } from "./../_exports";
export interface SourceManga {
    /*
    * internalName: mangaId
    */
    id: string;
    mangaInfo: Manga;
}
declare global {
    namespace App {
        function createSourceManga(info: {
            id: string
            mangaInfo: Manga
        }): SourceManga;
    }
}
