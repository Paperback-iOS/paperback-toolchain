import { DUIFormRow } from "./../../../_exports"
export type DUILabel = DUIFormRow
declare global {
    namespace Paperback {
        function createDUILabel(info: {
            id: string
            label: string
            value?: string
        }): DUILabel
    }
}
