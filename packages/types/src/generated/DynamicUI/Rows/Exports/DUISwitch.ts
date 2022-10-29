import { DUIFormRow } from "./../../../_exports";
import { DUIBinding } from "./../../../_exports";
export interface DUISwitch extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUISwitch(info: {
            id: string
            label: string
            value: DUIBinding
        }): DUISwitch;
    }
}
