import { SecureStateManager } from "./../_exports";
export interface SourceStateManagerProps {
    readonly keychain: SecureStateManager;
}
export interface SourceStateManager extends SourceStateManagerProps {
    /*
    * internalName: _store
    */
    store(key: any, value: any | undefined): any;
    /*
    * internalName: _retrieve
    */
    retrieve(key: any): any;
}
declare global {
    function createSourceStateManager(info: SourceStateManagerProps): SourceStateManager;
}
