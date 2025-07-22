/* eslint-disable @typescript-eslint/no-dynamic-delete */
import type { Cookie } from '../Cookie.js'
import { PaperbackInterceptor } from './PaperbackInterceptor.js'
import type { Request } from '../Request.js'
import type { Response } from '../Response.js'
import { URL } from './URL.js'

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
      if (this.isCookieExpired(cookie)) {
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
      ...this.cookiesForUrl(request.url).reduce(
        (v, c) => {
          v[c.name] = c.value
          return v
        },
        {} as Record<string, string>
      ),
    }

    return request
  }

  async interceptResponse(
    request: Request,
    response: Response,
    data: ArrayBuffer
  ): Promise<ArrayBuffer> {
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
    console.log('[COMPAT] COOKIES FOR URL')
    const url = new URL(urlString)
    const hostname = url.hostname

    if (!hostname) {
      return []
    }

    const matchedCookies: Record<
      string,
      { cookie: Cookie; pathMatches: number }
    > = {}

    const pathname = url.path.startsWith('/') ? url.path : `/${url.path}`

    const splitHostname = hostname.split('.')
    const splitUrlPath = pathname.split('/')
    splitUrlPath.shift()

    const cookies = this.cookies
    for (const cookie of cookies) {
      if (this.isCookieExpired(cookie)) {
        delete this._cookies[this.cookieIdentifier(cookie)]
        continue
      }

      const cookieDomain = this.cookieSanitizedDomain(cookie)
      const splitCookieDomain = cookieDomain.split('.')
      if (
        splitHostname.length < splitCookieDomain.length ||
        splitCookieDomain.length == 0
      ) {
        continue
      }

      let cookieDomainMatches = true
      for (let i = 0; i < splitCookieDomain.length; i++) {
        const splitCookieIndex = splitCookieDomain.length - 1 - i
        const splitHostnameIndex = splitHostname.length - 1 - i
        if (
          splitCookieDomain[splitCookieIndex] !=
          splitHostname[splitHostnameIndex]
        ) {
          cookieDomainMatches = false
          break
        }
      }

      if (!cookieDomainMatches) {
        continue
      }

      const cookiePath = this.cookieSanitizedPath(cookie)
      const splitCookiePath = cookiePath.split('/')
      splitCookiePath.shift()

      let pathMatches = 0
      if (pathname === cookiePath) {
        pathMatches = Number.MAX_SAFE_INTEGER
      } else if (splitCookiePath.length === 0 || cookiePath === '/') {
        pathMatches = 1
      } else if (
        pathname.startsWith(cookiePath) &&
        splitUrlPath.length >= splitCookiePath.length
      ) {
        for (let i = 0; i < splitCookiePath.length; i++) {
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

    return Object.values(matchedCookies).map((x) => x.cookie)
  }

  private cookieIdentifier(cookie: Cookie): string {
    return `${cookie.name}-${this.cookieSanitizedDomain(
      cookie
    )}-${this.cookieSanitizedPath(cookie)}`
  }

  private cookieSanitizedPath(cookie: Cookie): string {
    return cookie.path?.startsWith('/')
      ? cookie.path
      : '/' + (cookie.path ?? '')
  }

  private cookieSanitizedDomain(cookie: Cookie): string {
    return cookie.domain.replace(/^(www)?\.?/gi, '').toLowerCase()
  }

  private isCookieExpired(cookie: Cookie): boolean {
    if (cookie.expires && cookie.expires.getTime() <= Date.now()) {
      return true
    } else {
      return false
    }
  }

  private loadCookiesFromStorage() {
    // If this stores in memory, we probably already have the latest cookies
    if (this.options.storage == 'memory') return

    const cookieData = Application.getState(cookieStateKey) as
      | Cookie[]
      | undefined
    if (!cookieData) {
      this._cookies = {}
      return
    }

    const cookies: Record<string, Cookie> = {}
    for (const cookie of cookieData) {
      // ignore session cookies and expired cookies
      if (!cookie.expires || this.isCookieExpired(cookie)) continue

      cookies[this.cookieIdentifier(cookie)] = cookie
    }

    this._cookies = cookies
  }

  private saveCookiesToStorage() {
    // If this stores in memory, we probably already have the latest cookies
    if (this.options.storage == 'memory') return

    // TODO: handle secure cookies differently maybe?
    Application.setState(
      this.cookies.filter((x) => x.expires),
      cookieStateKey
    )
  }
}

/**
 * 
 *  Test cases for testing cookies are behaving as expected
 * 

function assert(a: boolean, msg: string) {
    if(!a) {
        throw msg
    }
}

(function runTests() {
  const cookieStorage = new CookieStorageInterceptor();
  const now = Date.now();

  // Test 1: Basic set and retrieval
  const cookie1: Cookie = {
    name: "sessionId",
    value: "abc123",
    domain: "example.com",
    path: "/",
    expires: new Date(now + 10000) // expires in 10 seconds
  };
  cookieStorage.setCookie(cookie1);
  let cookies = cookieStorage.cookiesForUrl("http://example.com/");
  assert(cookies.length === 1, "Should retrieve one cookie for example.com root");

  // Test 2: Domain matching with subdomain (RFC 6265: domain-match)
  const cookie2: Cookie = {
    name: "user",
    value: "john",
    domain: "example.com",
    path: "/",
    expires: new Date(now + 10000)
  };
  cookieStorage.setCookie(cookie2);
  cookies = cookieStorage.cookiesForUrl("http://www.example.com/");
  assert(
    cookies.some(c => c.name === "user"),
    "Cookie with domain example.com should match www.example.com"
  );

  // Test 3: Path matching
  const cookie3: Cookie = {
    name: "pref",
    value: "dark",
    domain: "example.com",
    path: "/docs",
    expires: new Date(now + 10000)
  };
  cookieStorage.setCookie(cookie3);
  cookies = cookieStorage.cookiesForUrl("http://example.com/docs/index.html");
  assert(
    cookies.some(c => c.name === "pref"),
    "Cookie with path /docs should match /docs/index.html"
  );
  cookies = cookieStorage.cookiesForUrl("http://example.com/about");
  assert(
    !cookies.some(c => c.name === "pref"),
    "Cookie with path /docs should not match /about"
  );

  // Test 4: Expired cookie should not be stored or returned
  const cookie4: Cookie = {
    name: "expired",
    value: "old",
    domain: "example.com",
    path: "/",
    expires: new Date(now - 10000) // expired 10 seconds ago
  };
  cookieStorage.setCookie(cookie4);
  cookies = cookieStorage.cookiesForUrl("http://example.com/");
  assert(
    !cookies.some(c => c.name === "expired"),
    "Expired cookie should not be returned"
  );

  // Test 5: Cookie overwriting based on path specificity
  // Cookie with name "id" and path "/" (less specific)
  const cookieA: Cookie = {
    name: "id",
    value: "A",
    domain: "example.com",
    path: "/",
    expires: new Date(now + 10000)
  };
  // Cookie with the same name but a more specific path "/docs"
  const cookieB: Cookie = {
    name: "id",
    value: "B",
    domain: "example.com",
    path: "/docs",
    expires: new Date(now + 10000)
  };
  cookieStorage.setCookie(cookieA);
  cookieStorage.setCookie(cookieB);
  cookies = cookieStorage.cookiesForUrl("http://example.com/docs");
  const cookieId = cookies.find(c => c.name === "id");
  assert(
    cookieId?.value === "B",
    "More specific cookie should be returned for URL /docs"
  );

  // Test 6: Deleting a cookie
  cookieStorage.deleteCookie(cookieB);
  cookies = cookieStorage.cookiesForUrl("http://example.com/docs");
  const cookieIdAfterDelete = cookies.find(c => c.name === "id");
  assert(
    cookieIdAfterDelete?.value === "A",
    "After deletion of the specific cookie, the less specific cookie should be returned"
  );

  // Test 7: Using the cookies setter (expired cookies filtered out)
  cookieStorage.cookies = [cookie1, cookie4]; // cookie4 is expired
  const storedCookies = cookieStorage.cookies;
  assert(
    storedCookies.some(c => c.name === "sessionId"),
    "sessionId cookie should be stored via setter"
  );
  assert(
    !storedCookies.some(c => c.name === "expired"),
    "Expired cookie should be filtered out in the setter"
  );

  console.log("All tests passed successfully.");
})();
 */
