import { SecureStateManager, SourceStateManager } from "@paperback/types"
import { PaperbackPolyfills } from "./PaperbackPolyfills"

class MockSourceStateManager implements SourceStateManager {
    readonly keychain: SecureStateManager = new MockSourceStateManager()

    private objectStore: Record<any, any> = {}

    store(key: any, value: any) {
        this.objectStore[key] = value
    }
    retrieve(key: any) {
        return this.objectStore[key]
    }
}

PaperbackPolyfills.createSourceStateManager = function (): SourceStateManager {
    return new MockSourceStateManager()
}