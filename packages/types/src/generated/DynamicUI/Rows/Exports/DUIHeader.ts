import { DUIFormRow } from "./../../../_exports"
export type DUIHeader = DUIFormRow
declare global {
	namespace Paperback {
		function createDUIHeader(info: {
			id: string
			imageUrl: string
			title: string
			subtitle?: string
		}): DUIHeader
	}
}
