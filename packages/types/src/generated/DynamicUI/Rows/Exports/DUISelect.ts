import { DUIFormRow } from "./../../../_exports";
import { DUIBinding } from "./../../../_exports";
export interface DUISelect extends DUIFormRow {
    /*
    * internalName: _labelResolver
    */
    readonly labelResolver: (arg0: string) => Promise<string>;
}
declare global {
    namespace App {
        function createDUISelect(info: {
            id: string
            label: string
            options: string[]
            value: DUIBinding
            allowsMultiselect: boolean
            labelResolver: (arg0: string) => Promise<string>
        }): DUISelect;
    }
}
