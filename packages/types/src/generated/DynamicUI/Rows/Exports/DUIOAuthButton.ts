import { DUIFormRow } from "./../../../_exports";
export interface DUIOAuthButton extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIOAuthButton(info: DUIOAuthButton): DUIOAuthButton;
    }
}
