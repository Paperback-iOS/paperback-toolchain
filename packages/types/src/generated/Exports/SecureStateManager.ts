export interface SecureStateManager {
    /*
    * internalName: _store
    */
    store(key: string, value: any): Promise<void>;
    /*
    * internalName: _retrieve
    */
    retrieve(key: string): Promise<any>;
}
