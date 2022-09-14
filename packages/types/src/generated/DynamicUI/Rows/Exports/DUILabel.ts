import { DUIFormRow } from "./../../../_exports";
export interface DUILabel extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUILabel(info: {
            id: string
            label: string
            value?: string
        }): DUILabel;
    }
}
