import { Request, Cookie } from '@paperback/types'

globalThis.createCookie = function (cookie: Cookie): Cookie {
    return cookie
}

globalThis.createRequestObject = function(request: Request): Request {
    return request
}