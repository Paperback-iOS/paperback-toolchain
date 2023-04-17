import { RequestManager } from "../.."

/**
 * @deprecated use {@link RequestManagerProviding}
 */
export type Requestable = RequestManagerProviding

export interface RequestManagerProviding {
    readonly requestManager: RequestManager
}