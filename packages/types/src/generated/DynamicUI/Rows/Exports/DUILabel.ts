import { DUIFormRow } from "./../../../_exports";
export interface DUILabel extends DUIFormRow {
}
declare global {
    function createDUILabel(info: DUILabel): DUILabel;
}
