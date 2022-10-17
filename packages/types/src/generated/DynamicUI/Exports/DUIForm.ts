import { DUISection } from "./../../_exports";
export interface DUIForm {
    /*
    * internalName: _onSubmit
    */
    onSubmit(values: Record<any, any>): Promise<void> | undefined;
    /*
    * internalName: _sections
    */
    sections(): Promise<DUISection[]>;
}
declare global {
    namespace App {
        function createDUIForm(info: {
            sections: () => Promise<DUISection[]>
            onSubmit?: (arg0: Record<any, any>) => Promise<void>
        }): DUIForm;
    }
}
