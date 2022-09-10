import { DUIFormRow } from "./../../../_exports";
export interface DUIMultilineLabel extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIMultilineLabel(info: DUIMultilineLabel): DUIMultilineLabel;
    }
}
