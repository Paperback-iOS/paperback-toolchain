import { DUIFormRow } from "./../../../_exports";
export interface DUINavigationButton extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUINavigationButton(info: DUINavigationButton): DUINavigationButton;
    }
}
