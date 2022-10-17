export interface DUIBinding {
    /*
    * internalName: _get
    */
    get(): Promise<any>;
    /*
    * internalName: _set
    */
    set(newValue: any): Promise<void>;
}
declare global {
    namespace App {
        function createDUIBinding(info: {
            get: () => Promise<any>
            set?: (arg0: any) => Promise<void>
        }): DUIBinding;
    }
}
