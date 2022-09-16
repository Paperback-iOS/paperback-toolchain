import { CheerioAPI } from "cheerio"
import { DUIForm, PagedResults, RequestManager, SearchRequest, SourceManga, DUISection, TrackerActionQueue, TrackedManga } from ".."
import { Requestable, Searchable } from "./interfaces"

export abstract class Tracker implements Requestable, Searchable {
    /**
     * Manages the ratelimits and the number of requests that can be done per second
     * This is also used to fetch pages when a chapter is downloading
     */
    abstract readonly requestManager: RequestManager
    constructor(protected cheerio: CheerioAPI) {}

    abstract getSearchResults(query: SearchRequest, metadata: unknown): Promise<PagedResults>

    /// This cannot be async since the app expects a form as soon as this function is called
    /// for async tasks handle them in `sections`.
    abstract getMangaForm(mangaId: string): DUIForm

    abstract getMangaDetails(mangaId: string): Promise<SourceManga>
    abstract getTrackedManga(mangaId: string): Promise<TrackedManga>
    abstract getSourceMenu(): Promise<DUISection>

    /// This method MUST dequeue all actions and process them, any unsuccessful actions
    /// must be marked for retry instead of being left in the queue.
    /// NOTE: Retried actions older than 24 hours will be discarded
    abstract processActionQueue(actionQueue: TrackerActionQueue): Promise<void>
}