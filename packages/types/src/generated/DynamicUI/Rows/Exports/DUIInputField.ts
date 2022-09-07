import { DUIFormRow } from "./../../../_exports";
export interface DUIInputField extends DUIFormRow {
}
declare global {
    function createDUIInputField(info: DUIInputField): DUIInputField;
}
