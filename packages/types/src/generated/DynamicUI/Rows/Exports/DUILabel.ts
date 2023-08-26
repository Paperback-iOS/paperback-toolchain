import { DUIFormRow } from "./../../../_exports"
export type DUILabel = DUIFormRow
declare global {
	namespace App {
		function createDUILabel(info: {
			id: string
			label: string
			value?: string
		}): DUILabel
	}
}
