import { DUIFormRow } from "./../../../_exports"
export type DUILink = DUIFormRow
declare global {
    namespace Paperback {
        function createDUILink(info: {
            id: string
            label: string
            value?: string
        }): DUILink
    }
}
