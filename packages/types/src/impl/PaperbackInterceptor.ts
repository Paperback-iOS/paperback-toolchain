import type { Request } from '../Request.js'
import type { Response } from '../Response.js'

export abstract class PaperbackInterceptor {
  constructor(public id: string) {}

  abstract interceptRequest(request: Request): Promise<Request>
  abstract interceptResponse(
    request: Request,
    response: Response,
    data: ArrayBuffer
  ): Promise<ArrayBuffer>

  registerInterceptor() {
    Application.registerInterceptor(
      this.id,
      Application.Selector(this as PaperbackInterceptor, 'interceptRequest'),
      Application.Selector(this as PaperbackInterceptor, 'interceptResponse')
    )
  }

  unregisterInterceptor() {
    Application.unregisterInterceptor(this.id)
  }
}
