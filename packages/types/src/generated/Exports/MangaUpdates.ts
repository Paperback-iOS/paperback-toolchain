export interface MangaUpdates {
	ids: string[]
}
declare global {
	namespace Paperback {
		function createMangaUpdates(info: {
			ids: string[]
		}): MangaUpdates
	}
}
