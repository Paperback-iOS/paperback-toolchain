import { SecureStateManager } from "./../_exports";
export interface SourceStateManager {
    readonly keychain: SecureStateManager;
    /*
    * internalName: _store
    */
    store(key: string, value: any): Promise<void>;
    /*
    * internalName: _retrieve
    */
    retrieve(key: string): Promise<any>;
}
declare global {
    namespace App {
        function createSourceStateManager(): SourceStateManager;
    }
}
