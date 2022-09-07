import { DUIFormRow } from "./../../../_exports";
export interface DUIButton extends DUIFormRow {
}
declare global {
    function createDUIButton(info: DUIButton): DUIButton;
}
