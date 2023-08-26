import { DUIFormRow } from "./../../../_exports"
export type DUIButton = DUIFormRow
declare global {
	namespace App {
		function createDUIButton(info: {
			id: string
			label: string
			onTap: () => Promise<void>
		}): DUIButton
	}
}
