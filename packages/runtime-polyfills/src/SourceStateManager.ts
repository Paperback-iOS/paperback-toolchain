import { SecureStateManager, SourceStateManager } from "@paperback/types"
import { PaperbackPolyfills } from "./PaperbackPolyfills"

class MockSecureStateManager implements SecureStateManager {
    private objectStore: Record<string, any> = {}

    async store(key: string, value: any) {
        this.objectStore[key] = value
    }

    async retrieve(key: string) {
        return this.objectStore[key]
    }
}

class MockSourceStateManager implements SourceStateManager {
    readonly keychain: SecureStateManager = new MockSecureStateManager()
    private objectStore: Record<string, any> = {}

    async store(key: string, value: any) {
        this.objectStore[key] = value
    }

    async retrieve(key: string) {
        return this.objectStore[key]
    }
}

PaperbackPolyfills.createSourceStateManager = function (): SourceStateManager {
    return new MockSourceStateManager()
}