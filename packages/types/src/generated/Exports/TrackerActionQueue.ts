import { TrackedMangaChapterReadAction } from "./../_exports";
export interface TrackerActionQueue {
    /*
    * internalName: JSPromise_queuedChapterReadActions
    */
    queuedChapterReadActions(): any;
    /*
    * internalName: JSPromise_retryChapterReadAction
    */
    retryChapterReadAction(chapterReadAction: TrackedMangaChapterReadAction): any;
    /*
    * internalName: JSPromise_discardChapterReadAction
    */
    discardChapterReadAction(chapterReadAction: TrackedMangaChapterReadAction): any;
}
