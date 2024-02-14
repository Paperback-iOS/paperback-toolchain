import { DUIFormRow } from "./../../../_exports"
import { DUIBinding } from "./../../../_exports"
export type DUISwitch = DUIFormRow
declare global {
    namespace Paperback {
        function createDUISwitch(info: {
            id: string
            label: string
            value: DUIBinding
        }): DUISwitch
    }
}
