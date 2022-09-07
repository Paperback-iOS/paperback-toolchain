export interface MangaUpdates {
    ids: string[];
}
declare global {
    function createMangaUpdates(info: MangaUpdates): MangaUpdates;
}
