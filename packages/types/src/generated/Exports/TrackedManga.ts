import { Manga } from "./../_exports";
export interface TrackedManga {
    /*
    * internalName: mangaId
    */
    id: string;
    mangaInfo: Manga;
}
declare global {
    function createTrackedManga(info: TrackedManga): TrackedManga;
}
