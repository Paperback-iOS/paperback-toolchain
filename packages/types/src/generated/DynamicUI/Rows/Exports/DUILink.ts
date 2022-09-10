import { DUIFormRow } from "./../../../_exports";
export interface DUILink extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUILink(info: DUILink): DUILink;
    }
}
