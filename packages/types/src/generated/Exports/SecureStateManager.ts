export interface SecureStateManager {
    /*
    * internalName: _store
    */
    store(key: any, value: any | undefined): any;
    /*
    * internalName: _retrieve
    */
    retrieve(key: any): any;
}
