export interface PartialSourceManga {
    mangaId: string;
    title: string;
    image: string;
    subtitle?: string;
}
declare global {
    namespace App {
        function createPartialSourceManga(info: PartialSourceManga): PartialSourceManga;
    }
}
