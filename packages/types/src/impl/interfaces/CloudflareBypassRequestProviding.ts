import type { Cookie } from '../../Cookie.js'

export interface CloudflareBypassRequestProviding {
  saveCloudflareBypassCookies(cookies: Cookie[]): Promise<void>
}
