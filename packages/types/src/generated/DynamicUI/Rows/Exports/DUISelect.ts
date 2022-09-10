import { DUIFormRow } from "./../../../_exports";
export interface DUISelect extends DUIFormRow {
    /*
    * internalName: _labelResolver
    */
    readonly labelResolver: (arg0: string) => Promise<string>;
}
declare global {
    namespace App {
        function createDUISelect(info: DUISelect): DUISelect;
    }
}
