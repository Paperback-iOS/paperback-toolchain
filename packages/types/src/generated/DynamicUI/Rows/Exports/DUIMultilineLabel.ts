import { DUIFormRow } from "./../../../_exports"
export type DUIMultilineLabel = DUIFormRow
declare global {
	namespace Paperback {
		function createDUIMultilineLabel(info: {
			id: string
			label: string
			value: string
		}): DUIMultilineLabel
	}
}
