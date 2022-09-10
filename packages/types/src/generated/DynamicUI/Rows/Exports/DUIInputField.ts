import { DUIFormRow } from "./../../../_exports";
export interface DUIInputField extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIInputField(info: DUIInputField): DUIInputField;
    }
}
