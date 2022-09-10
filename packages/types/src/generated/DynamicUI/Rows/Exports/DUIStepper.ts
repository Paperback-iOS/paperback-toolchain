import { DUIFormRow } from "./../../../_exports";
export interface DUIStepper extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIStepper(info: DUIStepper): DUIStepper;
    }
}
