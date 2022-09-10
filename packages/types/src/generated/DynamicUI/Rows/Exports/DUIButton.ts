import { DUIFormRow } from "./../../../_exports";
export interface DUIButton extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIButton(info: DUIButton): DUIButton;
    }
}
