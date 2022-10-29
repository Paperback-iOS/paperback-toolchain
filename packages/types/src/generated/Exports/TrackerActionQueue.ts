import { TrackedMangaChapterReadAction } from "./../_exports";
export interface TrackerActionQueue {
    /*
    * internalName: _queuedChapterReadActions
    */
    queuedChapterReadActions(): Promise<TrackedMangaChapterReadAction[]>;
    /*
    * internalName: _retryChapterReadAction
    */
    retryChapterReadAction(chapterReadAction: TrackedMangaChapterReadAction): Promise<void>;
    /*
    * internalName: _discardChapterReadAction
    */
    discardChapterReadAction(chapterReadAction: TrackedMangaChapterReadAction): Promise<void>;
}
