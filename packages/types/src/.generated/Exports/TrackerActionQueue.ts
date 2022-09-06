import { TrackerActionQueueProps } from "./../_exports";
import { TrackedMangaChapterReadAction } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
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
