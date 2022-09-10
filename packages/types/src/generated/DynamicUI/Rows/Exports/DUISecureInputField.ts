import { DUIFormRow } from "./../../../_exports";
export interface DUISecureInputField extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUISecureInputField(info: DUISecureInputField): DUISecureInputField;
    }
}
