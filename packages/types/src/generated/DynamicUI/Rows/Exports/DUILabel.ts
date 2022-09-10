import { DUIFormRow } from "./../../../_exports";
export interface DUILabel extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUILabel(info: DUILabel): DUILabel;
    }
}
