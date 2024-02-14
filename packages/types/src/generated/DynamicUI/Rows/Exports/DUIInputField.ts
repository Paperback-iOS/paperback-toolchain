import { DUIFormRow } from "./../../../_exports"
import { DUIBinding } from "./../../../_exports"
export type DUIInputField = DUIFormRow
declare global {
    namespace Paperback {
        function createDUIInputField(info: {
            id: string
            label: string
            value: DUIBinding
        }): DUIInputField
    }
}
