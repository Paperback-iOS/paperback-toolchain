import { DUIFormRow } from "./../../../_exports";
export interface DUIHeader extends DUIFormRow {
}
declare global {
    function createDUIHeader(info: DUIHeader): DUIHeader;
}
