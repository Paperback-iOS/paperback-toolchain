import { SourceStateManagerProps, SourceStateManager } from "@paperback/types"

globalThis.createSourceStateManager = function (info: SourceStateManagerProps): SourceStateManager {
    return {
        ...info,
        store: function (key: string, value: unknown) {
            // Fill this in so the test classes don't commit sudoku
            virtualStateStore[key] = value
            return Promise.resolve()
        },
        retrieve: function (key: string) {
            return Promise.resolve(virtualStateStore[key])
        },
        keychain: {
            store: function (key: string, value: unknown) {
                // Fill this in so the test classes don't commit sudoku
                virtualKeychainStore[key] = value
                return Promise.resolve()
            },
            retrieve: function (key: string) {
                return Promise.resolve(virtualKeychainStore[key])
            }
        }
    }
}

var virtualStateStore: any = {}
var virtualKeychainStore: any = {}