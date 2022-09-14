export interface TrackedMangaChapterReadAction {
    readonly mangaId: string;
    readonly sourceMangaId: string;
    readonly sourceChapterId: string;
    readonly sourceId: string;
    readonly chapterNumber: number;
    readonly volumeNumber: number;
    readonly readTime: Date;
}
