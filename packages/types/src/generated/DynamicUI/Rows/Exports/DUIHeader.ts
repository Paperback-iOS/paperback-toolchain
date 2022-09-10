import { DUIFormRow } from "./../../../_exports";
export interface DUIHeader extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIHeader(info: DUIHeader): DUIHeader;
    }
}
