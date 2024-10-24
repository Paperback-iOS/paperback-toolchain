import type { Cookie } from "../../Cookie"

export interface CloudflareBypassRequestProviding {
  saveCloudflareBypassCookies(cookies: Cookie[]): Promise<void>;
}
