
import { Cookie, PaperbackInterceptor, Request, Response } from "..";

type CookieStorageOptions = {
    storage: 'stateManager' | 'memory'
}

const cookieStateKey = 'cookie_store_cookies'

export class CookieStorageInterceptor extends PaperbackInterceptor {
    private _cookies: Record<string, Cookie> = {}

    get cookies(): Readonly<Cookie[]> {
        return Object.freeze(Object.values(this._cookies))
    }

    set cookies(newValue: Cookie[]) {
        const cookies: Record<string, Cookie> = {}
        for (const cookie of newValue) {
            // If the cookie is already expired, skip
            if (cookie.expires && cookie.expires.getUTCMilliseconds() <= Date.now()) {
                continue
            }

            cookies[this.cookieIdentifier(cookie)] = cookie
        }

        this._cookies = cookies
        this.saveCookiesToStorage()
    }

    constructor(public readonly options: CookieStorageOptions) {
        super('cookie_store')
        this.loadCookiesFromStorage()
    }

    async interceptRequest(request: Request): Promise<Request> {
        request.cookies = {
            // Already set cookies
            ...(request.cookies ?? {}),

            // Inject all the cookies as { name: value }
            ...(this.cookiesForUrl(request.url).reduce(
                (v, c) => { v[c.name] = c.value; return v },
                {} as Record<string, string>
            ))
        }

        return request
    }

    async interceptResponse(request: Request, response: Response, data: ArrayBuffer): Promise<ArrayBuffer> {
        const cookies: Record<string, Cookie> = this._cookies

        for (const cookie of response.cookies) {
            const identifier = this.cookieIdentifier(cookie)

            // If the cookie is already expired, delete it
            // Usually backends "delete" a cookie by setting its
            // expiry in the past
            if (this.isCookieExpired(cookie)) {
                delete cookies[identifier]
                continue
            }

            cookies[identifier] = cookie
        }

        this._cookies = cookies
        this.saveCookiesToStorage()
        
        return data
    }

    setCookie(cookie: Cookie) {
        // If the cookie is already expired, skip
        if (this.isCookieExpired(cookie)) {
            return
        }

        this._cookies[this.cookieIdentifier(cookie)] = cookie
        this.saveCookiesToStorage()
    }

    deleteCookie(cookie: Cookie) {
        delete this._cookies[this.cookieIdentifier(cookie)]
    }

    cookiesForUrl(urlString: string): Cookie[] {
        const url = new URL(urlString)
        const matchedCookies: Record<string, { cookie: Cookie, pathMatches: number }> = {}
        const splitUrlPath = url.pathname.split('/')
        const cookies = this.cookies

        for (const cookie of cookies) {
            if (this.isCookieExpired(cookie)) {
                delete this._cookies[this.cookieIdentifier(cookie)]
                continue
            }

            const cookieDomain = this.cookieSanitizedDomain(cookie)
            if (cookieDomain != url.hostname) {
                continue
            }

            const cookiePath = this.cookieSanitizedPath(cookie)
            const splitCookiePath = cookiePath.split('/')
            let pathMatches = 0

            if (url.pathname === cookiePath) {
                pathMatches = Number.MAX_SAFE_INTEGER
            } else if (splitUrlPath.length === 0) {
                pathMatches = 1
            } else if (cookiePath.startsWith(url.pathname) && splitUrlPath.length >= splitCookiePath.length) {
                for (let i = 0; i < splitUrlPath.length; i++) {
                    if (splitCookiePath[i] === splitUrlPath[i]) {
                        pathMatches += 1
                    } else {
                        break
                    }
                }
            }

            if (pathMatches <= 0) {
                continue
            }

            if ((matchedCookies[cookie.name]?.pathMatches ?? 0) < pathMatches) {
                matchedCookies[cookie.name] = { cookie, pathMatches }
            }
        }

        return Object.values(matchedCookies).map(x => x.cookie)
    }

    private cookieIdentifier(cookie: Cookie): string {
        return `${cookie.name}-${this.cookieSanitizedDomain(cookie)}-${this.cookieSanitizedPath(cookie)}`
    }

    private cookieSanitizedPath(cookie: Cookie): string {
        return cookie.path?.startsWith('/') ? cookie.path : '/' + (cookie.path ?? '')
    }

    private cookieSanitizedDomain(cookie: Cookie): string {
        return cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain
    }

    private isCookieExpired(cookie: Cookie): boolean {
        if (cookie.expires && cookie.expires.getUTCMilliseconds() <= Date.now()) {
            return true
        } else { 
            return false 
        }
    }

    private loadCookiesFromStorage() {
        // If this stores in memory, we probably already have the latest cookies
        if (this.options.storage == 'memory') { return }

        const cookieData = Application.getState(cookieStateKey) as Cookie[] | undefined
        if (!cookieData) {
            this._cookies = {}
            return
        }

        const cookies: Record<string, Cookie> = {}
        for (const cookie of cookieData) {
            // ignore session cookies and expired cookies
            if (!cookie.expires || this.isCookieExpired(cookie)) { continue }

            cookies[this.cookieIdentifier(cookie)] = cookie
        }

        this._cookies = cookies
    }

    private saveCookiesToStorage() {
        // If this stores in memory, we probably already have the latest cookies
        if (this.options.storage == 'memory') { return }

        // TODO: handle secure cookies differently maybe?
        Application.setState(this.cookies.filter(x => x.expires), cookieStateKey)
    }
}