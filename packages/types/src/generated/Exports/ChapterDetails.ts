export interface ChapterDetails {
    id: string
    mangaId: string
    pages: string[]
}
declare global {
    namespace Paperback {
        function createChapterDetails(info: {
            id: string
            mangaId: string
            pages: string[]
        }): ChapterDetails
    }
}
