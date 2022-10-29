import { DUIFormRow } from "./../../../_exports";
import { DUIBinding } from "./../../../_exports";
export interface DUIInputField extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIInputField(info: {
            id: string
            label: string
            value: DUIBinding
        }): DUIInputField;
    }
}
