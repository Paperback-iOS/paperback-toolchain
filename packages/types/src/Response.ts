import { type Request } from './Request.js'
import { type Cookie } from './Cookie.js'

export type Response = {
  readonly url: string
  readonly headers: Record<string, string>
  readonly status: number
  readonly mimeType?: string

  /// This is only the new cookies set via the Set-Cookie header
  readonly cookies: Cookie[]
}

export type ResponseInterceptor = (
  request: Request,
  response: Response,
  data: ArrayBuffer
) => Promise<ArrayBuffer>
