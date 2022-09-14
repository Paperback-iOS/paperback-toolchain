import { DUIFormRow } from "./../../../_exports";
import { DUIForm } from "./../../../_exports";
export interface DUINavigationButton extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUINavigationButton(info: {
            id: string
            label: string
            form: DUIForm
        }): DUINavigationButton;
    }
}
