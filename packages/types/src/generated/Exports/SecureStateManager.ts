export interface SecureStateManagerProps {
}
export interface SecureStateManager extends SecureStateManagerProps {
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
        function createSecureStateManager(info: SecureStateManagerProps): SecureStateManager;
    }
}
