import { type Response } from './Response.js'

export type Request = {
  url: string
  method: string
  headers?: Record<string, string>
  body?: ArrayBuffer | object | string
  cookies?: Record<string, string>
}

export type RequestInterceptor = (request: Request) => Promise<Request>

/**
 * @param proposedRequest The `Request` to the new location specified by the redirect response.
 * @param redirectedResponse The `Response` containing the server's response to the original request.
 * @returns Return the proposed request or a modified request to follow the redirect, or undefined to cancel the redirect
 */
export type RedirectHandler = (
  proposedRequest: Request,
  redirectedResponse: Response
) => Promise<Request | undefined>
