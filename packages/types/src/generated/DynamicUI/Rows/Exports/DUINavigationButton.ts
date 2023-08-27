import { DUIFormRow } from "./../../../_exports"
import { DUIForm } from "./../../../_exports"
export type DUINavigationButton = DUIFormRow
declare global {
	namespace Paperback {
		function createDUINavigationButton(info: {
			id: string
			label: string
			form: DUIForm
		}): DUINavigationButton
	}
}
