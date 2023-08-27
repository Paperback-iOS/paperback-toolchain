import { DUIFormRow } from "./../../../_exports"
import { DUIBinding } from "./../../../_exports"
export type DUISecureInputField = DUIFormRow
declare global {
	namespace Paperback {
		function createDUISecureInputField(info: {
			id: string
			label: string
			value: DUIBinding
		}): DUISecureInputField
	}
}
