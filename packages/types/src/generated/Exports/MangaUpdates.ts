export interface MangaUpdates {
    ids: string[];
}
declare global {
    namespace App {
        function createMangaUpdates(info: {
            ids: string[]
        }): MangaUpdates;
    }
}
