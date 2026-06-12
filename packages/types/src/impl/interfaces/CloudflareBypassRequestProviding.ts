import type { Cookie } from '../../Cookie.js'

export interface CloudflareBypassRequestProviding {
  /** @deprecated use {@link cloudflareBypassCompleted} instead */
  saveCloudflareBypassCookies?(cookies: Cookie[]): Promise<void>

  cloudflareBypassCompleted?(
    request: Request,
    cookies: Cookie[],
    localStorage: Record<string, string>
  ): Promise<void>
}
