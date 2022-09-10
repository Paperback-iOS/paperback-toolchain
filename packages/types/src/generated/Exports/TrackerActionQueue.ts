import { TrackedMangaChapterReadAction } from "./../_exports";
export interface TrackerActionQueueProps {
}
export interface TrackerActionQueue extends TrackerActionQueueProps {
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
declare global {
    namespace App {
        function createTrackerActionQueue(info: TrackerActionQueueProps): TrackerActionQueue;
    }
}
