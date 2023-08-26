import { DUIFormRow } from "./../../../_exports"
export type DUIMultilineLabel = DUIFormRow
declare global {
	namespace App {
		function createDUIMultilineLabel(info: {
			id: string
			label: string
			value: string
		}): DUIMultilineLabel
	}
}
