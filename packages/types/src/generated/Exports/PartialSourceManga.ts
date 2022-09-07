export interface PartialSourceManga {
    mangaId: string;
    title: string;
    image: string;
    subtitle?: string;
}
declare global {
    function createPartialSourceManga(info: PartialSourceManga): PartialSourceManga;
}
