import type { Cookie } from '../../Cookie.js'
import type { Request } from '../../Request.js'

export interface CloudflareBypassRequestProviding {
  /** @deprecated use {@link cloudflareBypassCompleted} instead */
  saveCloudflareBypassCookies?(cookies: Cookie[]): Promise<void>

  cloudflareBypassCompleted?(
    request: Request,
    cookies: Cookie[],
    localStorage: Record<string, string>
  ): Promise<void>
}
