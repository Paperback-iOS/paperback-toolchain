import { DUIFormRow } from "./../../../_exports"
import { DUIBinding } from "./../../../_exports"
export type DUIStepper = DUIFormRow
declare global {
	namespace Paperback {
		function createDUIStepper(info: {
			id: string
			label: string
			value: DUIBinding
			min?: number
			max?: number
			step?: number
		}): DUIStepper
	}
}
