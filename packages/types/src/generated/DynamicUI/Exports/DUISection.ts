import { DUIFormRow } from "./../../_exports";
export interface DUISection {
    _rows(): Promise<DUIFormRow[]>;
}
declare global {
    namespace App {
        function createDUISection(info: {
            id: string
            header?: string
            footer?: string
            isHidden: boolean
            rows: () => Promise<DUIFormRow[]>
        }): DUISection;
    }
}
