import type { Request } from '../Request.js'

export class CloudflareError extends Error {
  public readonly type = 'cloudflareError'

  constructor(
    public readonly resolutionRequest: Request,
    message: string = 'Cloudflare bypass is required'
  ) {
    super(message)
  }
}
