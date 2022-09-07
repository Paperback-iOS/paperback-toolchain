import { PartialSourceManga } from "./../_exports";
export interface PagedResults {
    results: PartialSourceManga[];
    metadata?: any;
}
declare global {
    function createPagedResults(info: PagedResults): PagedResults;
}
