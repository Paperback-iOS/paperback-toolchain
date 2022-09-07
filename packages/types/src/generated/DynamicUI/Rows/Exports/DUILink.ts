import { DUIFormRow } from "./../../../_exports";
export interface DUILink extends DUIFormRow {
}
declare global {
    function createDUILink(info: DUILink): DUILink;
}
