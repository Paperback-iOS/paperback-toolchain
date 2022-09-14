import { PartialSourceManga } from "./../_exports";
export interface PagedResults {
    results: PartialSourceManga[];
    metadata?: any;
}
declare global {
    namespace App {
        function createPagedResults(info: {
            results?: PartialSourceManga[]
            metadata?: any
        }): PagedResults;
    }
}
