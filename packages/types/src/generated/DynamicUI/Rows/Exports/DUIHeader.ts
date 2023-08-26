import { DUIFormRow } from "./../../../_exports"
export type DUIHeader = DUIFormRow
declare global {
	namespace App {
		function createDUIHeader(info: {
			id: string
			imageUrl: string
			title: string
			subtitle?: string
		}): DUIHeader
	}
}
