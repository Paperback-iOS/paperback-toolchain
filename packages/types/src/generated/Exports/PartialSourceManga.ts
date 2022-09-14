export interface PartialSourceManga {
    mangaId: string;
    title: string;
    image: string;
    subtitle?: string;
}
declare global {
    namespace App {
        function createPartialSourceManga(info: {
            mangaId: string
            image: string
            title: string
            subtitle?: string
        }): PartialSourceManga;
    }
}
