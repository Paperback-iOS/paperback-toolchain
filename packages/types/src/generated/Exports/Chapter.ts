export interface Chapter {
    id: string;
    chapNum: number;
    langCode: string;
    name: string;
    volume: number;
    group: string;
    time: Date;
    sortingIndex: number;
}
declare global {
    namespace App {
        function createChapter(info: {
            id: string
            chapNum: number
            volume?: number
            name?: string
            group?: string
            time?: Date
            langCode?: string
            sortingIndex?: number
        }): Chapter;
    }
}
