import { PartialSourceManga } from "./../_exports"
export interface HomeSection {
	readonly id: string
	readonly title: string
	items: PartialSourceManga[]
	containsMoreItems: boolean
}
declare global {
	namespace Paperback {
		function createHomeSection(info: {
			id: string
			title: string
			type: string
			items?: PartialSourceManga[]
			containsMoreItems: boolean
		}): HomeSection
	}

	namespace Paperback {

	}
}
