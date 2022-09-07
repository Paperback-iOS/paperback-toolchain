import { DUIFormRow } from "./../../../_exports";
export interface DUISecureInputField extends DUIFormRow {
}
declare global {
    function createDUISecureInputField(info: DUISecureInputField): DUISecureInputField;
}
