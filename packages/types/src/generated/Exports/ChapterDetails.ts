export interface ChapterDetails {
    id: string;
    mangaId: string;
    pages: string[];
}
declare global {
    namespace App {
        function createChapterDetails(info: {
            id: string
            mangaId: string
            pages: string[]
        }): ChapterDetails;
    }
}
