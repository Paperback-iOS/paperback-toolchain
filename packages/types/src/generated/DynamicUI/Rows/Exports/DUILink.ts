import { DUIFormRow } from "./../../../_exports";
export interface DUILink extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUILink(info: {
            id: string
            label: string
            value?: string
        }): DUILink;
    }
}
