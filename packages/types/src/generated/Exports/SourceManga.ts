import { Manga } from "./../_exports";
export interface SourceManga {
    /*
    * internalName: mangaId
    */
    id: string;
    mangaInfo: Manga;
}
declare global {
    function createSourceManga(info: SourceManga): SourceManga;
}
