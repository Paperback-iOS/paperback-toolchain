import { Cookie, Request } from "../.."

export interface CloudflareBypassRequestProviding {
    saveCloudflareBypassCookies(cookies: Cookie[]): Promise<void>
}
