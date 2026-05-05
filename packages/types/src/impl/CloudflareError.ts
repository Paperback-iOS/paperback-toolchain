import type { Request } from '../Request.js'

/**
 * The app catches this request and displays a banner at the top that initiates cloudflare bypass
 *
 * NOTE: You must have {@link SourceIntents.CLOUDFLARE_BYPASS_PROVIDING} for this to work
 */
export class CloudflareError extends Error {
  public readonly type = 'cloudflareError'

  constructor(
    public readonly resolutionRequest: Request,
    message: string = 'Cloudflare bypass is required'
  ) {
    super(message)
  }
}
