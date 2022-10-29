import { DUIFormRow } from "./../../../_exports";
import { DUIBinding } from "./../../../_exports";
export interface DUISecureInputField extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUISecureInputField(info: {
            id: string
            label: string
            value: DUIBinding
        }): DUISecureInputField;
    }
}
