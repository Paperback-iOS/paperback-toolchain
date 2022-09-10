export interface ChapterDetails {
    id: string;
    mangaId: string;
    pages: string[];
    longStrip: boolean;
}
declare global {
    namespace App {
        function createChapterDetails(info: ChapterDetails): ChapterDetails;
    }
}
