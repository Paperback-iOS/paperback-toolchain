import { DUIFormRow } from "./../../../_exports";
export interface DUISwitch extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUISwitch(info: DUISwitch): DUISwitch;
    }
}
