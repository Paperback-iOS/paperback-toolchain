import { SecureStateManager } from "./../_exports";
export interface SourceStateManager {
    readonly keychain: SecureStateManager;
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
    namespace App {
        function createSourceStateManager(): SourceStateManager;
    }
}
