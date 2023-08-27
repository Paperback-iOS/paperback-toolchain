import { PartialSourceManga } from "./../_exports"
export interface PagedResults {
	results: PartialSourceManga[]
	metadata?: any
}
declare global {
	namespace Paperback {
		function createPagedResults(info: {
			results?: PartialSourceManga[]
			metadata?: any
		}): PagedResults
	}
}
