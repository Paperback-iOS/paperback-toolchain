import { DUIFormRow } from "./../../../_exports";
export interface DUIHeader extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIHeader(info: {
            id: string
            imageUrl: string
            title: string
            subtitle?: string
        }): DUIHeader;
    }
}
