"use strict";
var wrapper = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/compat/0.8/wrapper.ts
  var wrapper_exports = {};
  __export(wrapper_exports, {
    CompatWrapper: () => CompatWrapper
  });

  // src/impl/SettingsUI/Form.ts
  var Form = class {
    reloadForm() {
      const formId = this["__underlying_formId"];
      if (!formId) return;
      Application.formDidChange(formId);
    }
    // If this returns true, the app will display `Submit` and `Cancel` buttons
    // and call the relevant methods when they are pressed
    get requiresExplicitSubmission() {
      return false;
    }
  };

  // src/impl/SettingsUI/FormItemElement.ts
  function LabelRow(id, props) {
    return { ...props, id, type: "labelRow", isHidden: props.isHidden ?? false };
  }
  function InputRow(id, props) {
    return { ...props, id, type: "inputRow", isHidden: props.isHidden ?? false };
  }
  function ToggleRow(id, props) {
    return { ...props, id, type: "toggleRow", isHidden: props.isHidden ?? false };
  }
  function ButtonRow(id, props) {
    return { ...props, id, type: "buttonRow", isHidden: props.isHidden ?? false };
  }
  function NavigationRow(id, props) {
    return {
      ...props,
      id,
      type: "navigationRow",
      isHidden: props.isHidden ?? false
    };
  }
  function OAuthButtonRow(id, props) {
    return {
      ...props,
      id,
      type: "oauthButtonRow",
      isHidden: props.isHidden ?? false
    };
  }

  // src/impl/SettingsUI/FormSection.ts
  function Section(params, items) {
    let info;
    if (typeof params === "string") {
      info = { id: params };
    } else {
      info = params;
    }
    return {
      ...info,
      items: items.filter(
        (x) => x
      )
    };
  }

  // src/impl/PaperbackInterceptor.ts
  var PaperbackInterceptor = class {
    constructor(id) {
      this.id = id;
    }
    registerInterceptor() {
      Application.registerInterceptor(
        this.id,
        Application.Selector(
          this,
          "interceptRequest"
        ),
        Application.Selector(
          this,
          "interceptResponse"
        )
      );
    }
    unregisterInterceptor() {
      Application.unregisterInterceptor(this.id);
    }
  };

  // src/impl/Lock.ts
  var promises = {};
  var resolvers = {};
  var lock = async (uid) => {
    if (promises[uid]) {
      await promises[uid];
      await lock(uid);
      return;
    }
    promises[uid] = new Promise(
      (resolve) => resolvers[uid] = () => {
        delete promises[uid];
        resolve();
      }
    );
  };
  var unlock = (uid) => {
    if (resolvers[uid]) {
      resolvers[uid]();
    }
  };

  // src/impl/BasicRateLimiter.ts
  var BasicRateLimiter = class extends PaperbackInterceptor {
    constructor(id, options) {
      super(id);
      this.options = options;
    }
    promise;
    currentRequestsMade = 0;
    lastReset = Date.now();
    imageRegex = new RegExp(/\.(png|gif|jpeg|jpg|webp)(\?|$)/i);
    async interceptRequest(request) {
      if (this.options.ignoreImages && this.imageRegex.test(request.url)) {
        return request;
      }
      await lock(this.id);
      await this.incrementRequestCount();
      unlock(this.id);
      return request;
    }
    async interceptResponse(request, response, data) {
      return data;
    }
    async incrementRequestCount() {
      await this.promise;
      const secondsSinceLastReset = (Date.now() - this.lastReset) / 1e3;
      if (secondsSinceLastReset > this.options.bufferInterval) {
        this.currentRequestsMade = 0;
        this.lastReset = Date.now();
      }
      this.currentRequestsMade += 1;
      if (this.currentRequestsMade >= this.options.numberOfRequests) {
        const secondsSinceLastReset2 = (Date.now() - this.lastReset) / 1e3;
        if (secondsSinceLastReset2 <= this.options.bufferInterval) {
          const sleepTime = this.options.bufferInterval - secondsSinceLastReset2;
          console.log(
            `[BasicRateLimiter] rate limit hit, sleeping for ${sleepTime}`
          );
          this.promise = Application.sleep(sleepTime);
        }
      }
    }
  };

  // src/impl/CloudflareError.ts
  var CloudflareError = class extends Error {
    constructor(resolutionRequest, message = "Cloudflare bypass is required") {
      super(message);
      this.resolutionRequest = resolutionRequest;
    }
    type = "cloudflareError";
  };

  // src/impl/URL.ts
  function parseURL(url) {
    const components = {};
    const regex = /^(?:([a-zA-Z][a-zA-Z\d+\-.]*):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid URL string provided.");
    }
    if (match[1] !== void 0 && match[1] !== "") {
      components.protocol = match[1];
    }
    if (match[2] !== void 0 && match[2] !== "") {
      let authority = match[2];
      let userInfo = "";
      let hostPort = "";
      const atIndex = authority.indexOf("@");
      if (atIndex !== -1) {
        userInfo = authority.substring(0, atIndex);
        hostPort = authority.substring(atIndex + 1);
        if (userInfo !== "") {
          const colonIndex = userInfo.indexOf(":");
          if (colonIndex !== -1) {
            components.username = userInfo.substring(0, colonIndex);
            components.password = userInfo.substring(colonIndex + 1);
          } else {
            components.username = userInfo;
            components.password = "";
          }
        }
      } else {
        hostPort = authority;
      }
      if (hostPort !== "") {
        if (hostPort.startsWith("[")) {
          const closingBracketIndex = hostPort.indexOf("]");
          if (closingBracketIndex === -1) {
            throw new Error("Invalid IPv6 address in URL update.");
          }
          components.hostname = hostPort.substring(0, closingBracketIndex + 1);
          const portPart = hostPort.substring(closingBracketIndex + 1);
          if (portPart.startsWith(":")) {
            components.port = portPart.substring(1);
          }
        } else {
          const colonIndex = hostPort.lastIndexOf(":");
          if (colonIndex !== -1 && hostPort.indexOf(":") === colonIndex) {
            components.hostname = hostPort.substring(0, colonIndex);
            components.port = hostPort.substring(colonIndex + 1);
          } else {
            components.hostname = hostPort;
            components.port = "";
          }
        }
      }
    }
    if (match[3] !== void 0 && match[3] !== "") {
      components.path = match[3].startsWith("/") ? match[3] : `/${match[3]}`;
    }
    if (match[4] !== void 0) {
      const query = {};
      const pairs = match[4].split("&");
      for (const pair of pairs) {
        if (!pair) continue;
        const [rawKey, rawValue = ""] = pair.split("=");
        if (rawKey === void 0) continue;
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(rawValue);
        if (key in query) {
          const existing = query[key];
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            query[key] = [existing, value];
          }
        } else {
          query[key] = value;
        }
      }
      components.queryItems = query;
    }
    if (match[5] !== void 0) {
      components.fragment = match[5];
    }
    return components;
  }
  var URL = class {
    protocol;
    hostname;
    path;
    username;
    password;
    port;
    queryItems = {};
    fragment;
    /**
     * Creates a new SimpleURL instance.
     * @param url - (Optional) A URL string to initialize the instance.
     */
    constructor(url) {
      const components = parseURL(url);
      if (!components.hostname || !components.protocol) {
        throw new Error("URL Hostname and Protocol are required");
      }
      this.hostname = components.hostname;
      this.protocol = components.protocol;
      this.path = components.path ?? "";
      this.username = components.username;
      this.password = components.password;
      this.port = components.port;
      this.queryItems = components.queryItems;
      this.fragment = components.fragment;
    }
    /**
     * Returns the full URL string built from the current components.
     */
    toString() {
      let url = `${this.protocol}://`;
      if (this.username !== void 0 && this.username !== "") {
        url += this.username;
        if (this.password !== void 0 && this.password !== "") {
          url += `:${this.password}`;
        }
        url += "@";
      }
      url += this.hostname;
      if (this.port !== void 0 && this.port !== "") {
        url += `:${this.port}`;
      }
      if (this.path !== "") {
        url += this.path.startsWith("/") ? this.path : `/${this.path}`;
      }
      if (this.queryItems !== void 0) {
        const queryKeys = Object.keys(this.queryItems);
        const params = [];
        if (queryKeys.length > 0) {
          for (const key of queryKeys) {
            const value = this.queryItems[key];
            if (Array.isArray(value)) {
              for (const v of value) {
                params.push(
                  `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
                );
              }
            } else if (value !== void 0) {
              params.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
              );
            }
          }
        }
        url += `?${params.join("&")}`;
      }
      if (this.fragment !== void 0) {
        url += `#${this.fragment}`;
      }
      return url;
    }
    /**
     * Convenience method to update the protocol.
     */
    setProtocol(newProtocol) {
      if (newProtocol === "") throw new Error("Protocol is required");
      this.protocol = newProtocol;
      return this;
    }
    /**
     * Convenience method to update the username.
     */
    setUsername(newUsername) {
      if (newUsername === "") this.username = void 0;
      else this.username = newUsername;
      return this;
    }
    /**
     * Convenience method to update the password.
     */
    setPassword(newPassword) {
      if (newPassword === "") this.password = void 0;
      else this.password = newPassword;
      return this;
    }
    /**
     * Convenience method to update the hostname.
     */
    setHostname(newHostname) {
      if (newHostname === "") throw new Error("Hostname is required");
      this.hostname = newHostname;
      return this;
    }
    /**
     * Convenience method to update the port.
     */
    setPort(newPort) {
      if (newPort === "") this.port = void 0;
      else this.port = newPort;
      return this;
    }
    /**
     * Convenience method to update the pathname.
     */
    setPath(newPathname) {
      this.path = newPathname.startsWith("/") ? newPathname : `/${newPathname}`;
      return this;
    }
    addPathComponent(component) {
      this.path = (this.path ?? "") + (component.startsWith("/") ? component : `/${component}`);
      return this;
    }
    /**
     * Replace the entire query object.
     */
    setQueryItems(newQuery) {
      this.queryItems = newQuery;
      return this;
    }
    /**
     * Update or add a single query parameter.
     */
    setQueryItem(key, value) {
      if (this.queryItems === void 0) this.queryItems = {};
      this.queryItems[key] = value;
      return this;
    }
    /**
     * Remove a query parameter.
     */
    removeQueryItem(key) {
      delete this.queryItems?.[key];
      return this;
    }
    /**
     * Convenience method to update the hash (fragment).
     */
    setFragment(newHash) {
      this.fragment = newHash;
      return this;
    }
    /**
     * Update the current URL components.
     *
     * Accepts either:
     * - A URL string, which may be a full URL (e.g., "https://example.com/path?foo=bar")
     *   or a partial URL (e.g., "/new/path?foo=bar#section"). In this case, only the components
     *   present in the string will be updated.
     * - A partial UrlComponents object.
     *
     * @param input - A URL string or a partial UrlComponents object.
     */
    update(input) {
      let components;
      if (typeof input === "string") {
        components = parseURL(input);
      } else {
        components = input;
      }
      if (components.protocol !== void 0)
        this.setProtocol(components.protocol);
      if (components.username !== void 0)
        this.setUsername(components.username);
      if (components.password !== void 0)
        this.setPassword(components.password);
      if (components.hostname !== void 0)
        this.setHostname(components.hostname);
      if (components.port !== void 0) this.setPort(components.port);
      if (components.path !== void 0) this.setPath(components.path);
      if (components.queryItems !== void 0)
        this.setQueryItems(components.queryItems);
      if (components.fragment !== void 0)
        this.setFragment(components.fragment);
      return this;
    }
  };

  // src/impl/CookieStorageInterceptor.ts
  var cookieStateKey = "cookie_store_cookies";
  var CookieStorageInterceptor = class extends PaperbackInterceptor {
    constructor(options) {
      super("cookie_store");
      this.options = options;
      this.loadCookiesFromStorage();
    }
    _cookies = {};
    get cookies() {
      return Object.freeze(Object.values(this._cookies));
    }
    set cookies(newValue) {
      const cookies = {};
      for (const cookie of newValue) {
        if (this.isCookieExpired(cookie)) {
          continue;
        }
        cookies[this.cookieIdentifier(cookie)] = cookie;
      }
      this._cookies = cookies;
      this.saveCookiesToStorage();
    }
    async interceptRequest(request) {
      request.cookies = {
        // Already set cookies
        ...request.cookies ?? {},
        // Inject all the cookies as { name: value }
        ...this.cookiesForUrl(request.url).reduce((v, c) => {
          v[c.name] = c.value;
          return v;
        }, {})
      };
      return request;
    }
    async interceptResponse(request, response, data) {
      const cookies = this._cookies;
      for (const cookie of response.cookies) {
        const identifier = this.cookieIdentifier(cookie);
        if (this.isCookieExpired(cookie)) {
          delete cookies[identifier];
          continue;
        }
        cookies[identifier] = cookie;
      }
      this._cookies = cookies;
      this.saveCookiesToStorage();
      return data;
    }
    setCookie(cookie) {
      if (this.isCookieExpired(cookie)) {
        return;
      }
      this._cookies[this.cookieIdentifier(cookie)] = cookie;
      this.saveCookiesToStorage();
    }
    deleteCookie(cookie) {
      delete this._cookies[this.cookieIdentifier(cookie)];
    }
    cookiesForUrl(urlString) {
      console.log("[COMPAT] COOKIES FOR URL");
      const url = new URL(urlString);
      const hostname = url.hostname;
      if (!hostname) {
        return [];
      }
      const matchedCookies = {};
      const pathname = url.path.startsWith("/") ? url.path : `/${url.path}`;
      const splitHostname = hostname.split(".");
      const splitUrlPath = pathname.split("/");
      splitUrlPath.shift();
      const cookies = this.cookies;
      for (const cookie of cookies) {
        if (this.isCookieExpired(cookie)) {
          delete this._cookies[this.cookieIdentifier(cookie)];
          continue;
        }
        const cookieDomain = this.cookieSanitizedDomain(cookie);
        const splitCookieDomain = cookieDomain.split(".");
        if (splitHostname.length < splitCookieDomain.length || splitCookieDomain.length == 0) {
          continue;
        }
        let cookieDomainMatches = true;
        for (let i = 0; i < splitCookieDomain.length; i++) {
          let splitCookieIndex = splitCookieDomain.length - 1 - i;
          let splitHostnameIndex = splitHostname.length - 1 - i;
          if (splitCookieDomain[splitCookieIndex] != splitHostname[splitHostnameIndex]) {
            cookieDomainMatches = false;
            break;
          }
        }
        if (!cookieDomainMatches) {
          continue;
        }
        const cookiePath = this.cookieSanitizedPath(cookie);
        const splitCookiePath = cookiePath.split("/");
        splitCookiePath.shift();
        let pathMatches = 0;
        if (pathname === cookiePath) {
          pathMatches = Number.MAX_SAFE_INTEGER;
        } else if (splitCookiePath.length === 0 || cookiePath === "/") {
          pathMatches = 1;
        } else if (pathname.startsWith(cookiePath) && splitUrlPath.length >= splitCookiePath.length) {
          for (let i = 0; i < splitCookiePath.length; i++) {
            if (splitCookiePath[i] === splitUrlPath[i]) {
              pathMatches += 1;
            } else {
              break;
            }
          }
        }
        if (pathMatches <= 0) {
          continue;
        }
        if ((matchedCookies[cookie.name]?.pathMatches ?? 0) < pathMatches) {
          matchedCookies[cookie.name] = { cookie, pathMatches };
        }
      }
      return Object.values(matchedCookies).map((x) => x.cookie);
    }
    cookieIdentifier(cookie) {
      return `${cookie.name}-${this.cookieSanitizedDomain(
        cookie
      )}-${this.cookieSanitizedPath(cookie)}`;
    }
    cookieSanitizedPath(cookie) {
      return cookie.path?.startsWith("/") ? cookie.path : "/" + (cookie.path ?? "");
    }
    cookieSanitizedDomain(cookie) {
      return cookie.domain.replace(/^(www)?\.?/gi, "").toLowerCase();
    }
    isCookieExpired(cookie) {
      if (cookie.expires && cookie.expires.getTime() <= Date.now()) {
        return true;
      } else {
        return false;
      }
    }
    loadCookiesFromStorage() {
      if (this.options.storage == "memory") return;
      const cookieData = Application.getState(cookieStateKey);
      if (!cookieData) {
        this._cookies = {};
        return;
      }
      const cookies = {};
      for (const cookie of cookieData) {
        if (!cookie.expires || this.isCookieExpired(cookie)) continue;
        cookies[this.cookieIdentifier(cookie)] = cookie;
      }
      this._cookies = cookies;
    }
    saveCookiesToStorage() {
      if (this.options.storage == "memory") return;
      Application.setState(
        this.cookies.filter((x) => x.expires),
        cookieStateKey
      );
    }
  };

  // src/PagedResults.ts
  var EndOfPageResults = Object.freeze({
    items: [],
    metadata: void 0
  });

  // src/compat/0.8/types.ts
  var AppCompat = {};
  AppCompat.createSourceStateManager = function() {
    return {
      keychain: {
        async store(key, value) {
          Application.setSecureState(value, key);
        },
        async retrieve(key) {
          return Application.getSecureState(key);
        }
      },
      async store(key, value) {
        Application.setState(value, key);
      },
      async retrieve(key) {
        return Application.getState(key);
      }
    };
  };
  function convert08RequestTo09Request(interceptedRequest) {
    let url = interceptedRequest.url;
    if (interceptedRequest.param) {
      url += interceptedRequest.param;
    }
    const cookies = {};
    for (const cookie of interceptedRequest.cookies ?? []) {
      cookies[cookie.name] = cookie.value;
    }
    return {
      url,
      method: interceptedRequest.method,
      body: interceptedRequest.data,
      headers: interceptedRequest.headers,
      cookies
    };
  }
  AppCompat.createRequestManager = function(info) {
    const interceptor = new class extends PaperbackInterceptor {
      constructor(legacyInterceptor) {
        super("main");
        this.legacyInterceptor = legacyInterceptor;
      }
      async interceptRequest(request) {
        if (!this.legacyInterceptor) return request;
        const oldRequest = {
          url: request.url,
          method: request.method,
          headers: request.headers ?? {},
          cookies: Object.keys(request.cookies ?? {}).map((x) => ({
            name: x,
            value: request.cookies[x],
            domain: ""
          }))
        };
        const interceptedRequest = await this.legacyInterceptor.interceptRequest(
          oldRequest
        );
        let url = interceptedRequest.url;
        if (interceptedRequest.param) {
          url += interceptedRequest.param;
        }
        const cookies = {};
        for (const cookie of interceptedRequest.cookies ?? []) {
          cookies[cookie.name] = cookie.value;
        }
        return {
          url,
          method: interceptedRequest.method,
          body: interceptedRequest.data,
          headers: interceptedRequest.headers,
          cookies
        };
      }
      async interceptResponse(request, response, data) {
        if (!this.legacyInterceptor) return data;
        return data;
      }
    }(info.interceptor);
    const rateLimiter = new BasicRateLimiter("rateLimit", {
      numberOfRequests: info.requestsPerSecond ?? 2,
      bufferInterval: 1,
      ignoreImages: true
    });
    const cookieStore = new CookieStorageInterceptor({ storage: "memory" });
    interceptor.registerInterceptor();
    rateLimiter.registerInterceptor();
    cookieStore.registerInterceptor();
    return {
      __backing_interceptor: interceptor,
      __backing_rateLimit: rateLimiter,
      __backing_cookieStore: cookieStore,
      interceptor: info.interceptor,
      cookieStore: {
        // @ts-expect-error
        getAllCookies() {
          return cookieStore.cookies;
        },
        addCookie(cookies) {
          cookieStore.setCookie(cookies);
        },
        removeCookie(cookie) {
          cookieStore.deleteCookie(cookie);
        }
      },
      async getDefaultUserAgent() {
        return Application.getDefaultUserAgent();
      },
      requestsPerSecond: info.requestsPerSecond ?? 2,
      requestTimeout: info.requestTimeout ?? 3e4,
      async schedule(request, retry) {
        const finalRequest = convert08RequestTo09Request(request);
        console.log("[COMPAT] SCHEDULING REQUEST TO " + finalRequest.url);
        const [response, data] = await Application.scheduleRequest(finalRequest);
        return {
          request,
          headers: response.headers,
          status: response.status,
          data: Application.arrayBufferToUTF8String(data),
          get rawData() {
            return new Uint8Array(data);
          }
        };
      }
    };
  };
  globalThis.App = new Proxy(AppCompat, {
    get(target, p) {
      if (target[p]) {
        return target[p];
      }
      if (typeof p === "string" && p.startsWith("create")) {
        if (p.startsWith("createDUI")) {
          const type = p.slice(6);
          return (anyProps) => {
            return Object.defineProperty(anyProps, "type", {
              enumerable: true,
              value: type
            });
          };
        }
        return (anyProps) => anyProps;
      }
      return void 0;
    }
  });

  // src/compat/0.8/wrapper.ts
  var CloudflareInterceptor = class extends PaperbackInterceptor {
    ERROR_CODES = [403, 503];
    SERVER_CHECK = ["cloudflare-nginx", "cloudflare"];
    COOKIE_NAMES = ["cf_clearance"];
    cloudflareRequestProvider;
    constructor(cloudflareRequestProvider) {
      super("cloudflareInterceptor");
      this.cloudflareRequestProvider = cloudflareRequestProvider;
    }
    async interceptRequest(request) {
      return request;
    }
    async interceptResponse(request, response, data) {
      const isCloudflare = this.SERVER_CHECK.includes(
        response.headers["Server"] ?? ""
      );
      const isError = this.ERROR_CODES.includes(response.status);
      if (isCloudflare && isError) {
        const cloudflareRequest = await this.cloudflareRequestProvider.getCloudflareBypassRequestAsync();
        const finalCloudflareRequest = convert08RequestTo09Request(cloudflareRequest);
        throw new CloudflareError(finalCloudflareRequest);
      }
      return data;
    }
  };
  var _CompatWrapper = class {
    constructor(legacySource) {
      this.legacySource = legacySource;
    }
    cloudflareInterceptor;
    homepageItemCache = {};
    async initialise() {
      if ("getCloudflareBypassRequestAsync" in this.legacySource) {
        this.cloudflareInterceptor = new CloudflareInterceptor(
          this.legacySource
        );
        this.cloudflareInterceptor.registerInterceptor();
      }
    }
    async getDiscoverSections() {
      const discoverSections = [];
      await this.legacySource.getHomePageSections?.((section) => {
        discoverSections.push({
          id: section.id,
          title: section.title,
          type: 1 /* simpleCarousel */
        });
        if (!section.containsMoreItems && section.items && section.items.length > 0) {
          this.homepageItemCache[section.id] = section.items.map((x) => {
            return {
              type: "simpleCarouselItem",
              title: x.title,
              subtitle: x.subtitle,
              mangaId: x.mangaId,
              imageUrl: x.image
            };
          });
        }
      });
      return discoverSections;
    }
    async getDiscoverSectionItems(section, metadata) {
      const cachedItems = this.homepageItemCache[section.id];
      if (cachedItems) {
        return { items: cachedItems };
      }
      const result = await this.legacySource.getViewMoreItems?.(
        section.id,
        metadata
      );
      if (result) {
        return {
          items: result.results.map((x) => {
            return {
              type: "simpleCarouselItem",
              title: x.title,
              subtitle: x.subtitle,
              mangaId: x.mangaId,
              imageUrl: x.image
            };
          }),
          metadata: result.metadata
        };
      } else {
        return EndOfPageResults;
      }
    }
    async getMangaDetails(mangaId) {
      const legacyManga = await this.legacySource.getMangaDetails(mangaId);
      return {
        mangaId: legacyManga.id,
        mangaInfo: {
          contentRating: "SAFE" /* EVERYONE */,
          primaryTitle: legacyManga.mangaInfo.titles.shift(),
          secondaryTitles: legacyManga.mangaInfo.titles,
          synopsis: legacyManga.mangaInfo.desc,
          thumbnailUrl: legacyManga.mangaInfo.image,
          status: legacyManga.mangaInfo.status
        }
      };
    }
    async getSearchFilters() {
      const searchFilters = [];
      const legacyFilters = this.legacySource.getSearchTags ? await this.legacySource.getSearchTags() : [];
      for (const filter of legacyFilters) {
        searchFilters.push({
          id: filter.id,
          title: filter.label,
          type: "multiselect",
          options: filter.tags.map((x) => {
            return { id: x.id, value: x.label };
          }),
          value: {},
          allowExclusion: true,
          allowEmptySelection: true,
          maximum: void 0
        });
      }
      return searchFilters;
    }
    async getSearchResults(query, metadata) {
      const legacyQuery = {
        title: query.title,
        includedTags: [],
        excludedTags: [],
        parameters: {}
      };
      for (const filter of query.filters) {
        if (typeof filter.value === "string") {
          legacyQuery.parameters[filter.id] = filter.value;
        } else {
          for (const tag of Object.keys(filter.value)) {
            if (filter.value[tag] === "included") {
              legacyQuery.includedTags.push({ id: tag, label: tag });
            } else {
              legacyQuery.excludedTags.push({ id: tag, label: tag });
            }
          }
        }
      }
      const legacyResults = await this.legacySource.getSearchResults(
        legacyQuery,
        metadata
      );
      return {
        items: legacyResults.results.map((x) => {
          return {
            imageUrl: x.image,
            title: x.title,
            mangaId: x.mangaId,
            subtitle: x.subtitle
          };
        }),
        metadata: legacyResults.metadata
      };
    }
    async getChapters(sourceManga, sinceDate) {
      const legacyChapters = await this.legacySource.getChapters(
        sourceManga.mangaId
      );
      return legacyChapters.map((x) => {
        return {
          chapNum: x.chapNum,
          volume: x.volume,
          sourceManga,
          publishDate: x.time,
          chapterId: x.id,
          langCode: x.langCode,
          title: x.name,
          version: x.group,
          sortingIndex: x.sortingIndex
        };
      });
    }
    async getChapterDetails(chapter) {
      return await this.legacySource.getChapterDetails(
        chapter.sourceManga.mangaId,
        chapter.chapterId
      );
    }
    async getSettingsForm() {
      if (this.legacySource.getSourceMenu) {
        let rootSection = await this.legacySource.getSourceMenu();
        return new _CompatForm({
          async sections() {
            return [rootSection];
          }
        });
      } else {
        throw new Error("Not Supported");
      }
    }
  };
  var _CompatSection = class {
    constructor(form, section) {
      this.form = form;
      this.section = section;
      this.id = section.id;
      this.header = section.header;
      this.footer = section.footer;
      this.reloadRows();
    }
    id;
    header;
    footer;
    bindingValueCache = {};
    items = [];
    proxies = {};
    reloadRows() {
      const newItems = [];
      this.items = newItems;
      console.log("reloadForm CALLED FROM reloadRows");
      this.form.reloadForm();
      this.section.rows().then((rows) => {
        if (this.items !== newItems) return;
        newItems.push(
          ...rows.map((row) => {
            const rowId = row["id"] ?? "unknown";
            switch (row["type"]) {
              case "DUIHeader": {
                const header = row;
                return LabelRow(rowId, {
                  title: header.title,
                  subtitle: header.subtitle
                });
              }
              case "DUILabel":
              case "DUIMultilineLabel": {
                const label = row;
                return LabelRow(rowId, {
                  title: label.label,
                  subtitle: label.value
                });
              }
              case "DUIOAuthButton": {
                const button = row;
                return OAuthButtonRow(rowId, {
                  title: button.label,
                  authorizeEndpoint: button.authorizeEndpoint,
                  clientId: button.clientId,
                  responseType: button.responseType,
                  redirectUri: button.redirectUri,
                  scopes: button.scopes,
                  onSuccess: this.proxifiedClosureSelector(
                    rowId,
                    button,
                    "successHandler"
                  )
                });
              }
              case "DUIButton": {
                const button = row;
                return ButtonRow(rowId, {
                  title: button.label,
                  onSelect: this.proxifiedClosureSelector(
                    rowId,
                    button,
                    "onTap"
                  )
                });
              }
              case "DUISecureInputField":
              case "DUIInputField": {
                const input = row;
                input.value.get().then((value) => {
                  if (this.bindingValueCache[rowId] !== value) {
                    console.log(
                      `NEW VALUE BY ${rowId}, ${this.bindingValueCache[rowId]}, ${value}`
                    );
                    this.bindingValueCache[rowId] = value;
                    this.reloadRows();
                  }
                }).catch((e) => {
                  console.log("ERROR:" + e);
                });
                return InputRow(rowId, {
                  title: input.label,
                  value: this.bindingValueCache[rowId] ?? "",
                  onValueChange: this.proxifiedClosureSelector(
                    rowId,
                    input.value,
                    "set"
                  )
                });
              }
              case "DUINavigationButton": {
                const button = row;
                return NavigationRow(rowId, {
                  title: button.label,
                  form: new _CompatForm(button.form)
                });
              }
              case "DUISwitch": {
                const toggle = row;
                toggle.value.get().then((value) => {
                  console.log("NEW VALUE: " + value);
                  if (this.bindingValueCache[rowId] !== value) {
                    console.log(
                      `NEW VALUE BY ${rowId}, ${this.bindingValueCache[rowId]}, ${value}`
                    );
                    this.bindingValueCache[rowId] = value;
                    this.reloadRows();
                  }
                }).catch((e) => {
                  console.log("ERROR:" + e);
                });
                return ToggleRow(rowId, {
                  title: toggle.label,
                  value: this.bindingValueCache[rowId] ?? false,
                  onValueChange: this.proxifiedClosureSelector(
                    rowId,
                    toggle.value,
                    "set"
                  )
                });
              }
              default: {
                return LabelRow(rowId, {
                  title: "Unsupported 0.8 Row",
                  subtitle: `ID: ${rowId};
Type: ${row["type"]}`
                });
              }
            }
          })
        );
        this.form.reloadForm();
      }).catch((e) => {
        console.log("ERROR:" + e);
      });
    }
    proxifiedClosureSelector(id, obj, method) {
      const form = this;
      const key = "__proxied_" + method;
      this.proxies[id] = Object.defineProperty(obj, key, {
        enumerable: true,
        value: function() {
          const ret = obj[method](...arguments);
          console.log(`CALLING ${method} WITH ${JSON.stringify(arguments)}`);
          if (ret.then) {
            ret.then((_) => form.reloadRows());
          } else {
            form.reloadRows();
          }
          return ret;
        }
      });
      return Application.Selector(this.proxies[id], key);
    }
  };
  var _CompatForm = class extends Form {
    constructor(form) {
      super();
      this.form = form;
    }
    sections = [];
    getSections() {
      if (this.sections.length == 0) {
        return [
          Section("loading", [
            LabelRow("loading", {
              title: "Loading Sections..."
            })
          ])
        ];
      }
      return this.sections;
    }
    reloadSections() {
      const newSections = [];
      this.sections = newSections;
      console.log("reloadForm CALLED FROM reloadSections");
      this.reloadForm();
      this.form.sections().then((sections) => {
        if (this.sections !== newSections) return;
        this.sections.push(
          ...sections.map((section) => {
            return new _CompatSection(this, section);
          })
        );
        this.reloadForm();
      });
    }
    formWillAppear() {
      this.reloadSections();
    }
  };
  function CompatWrapper(info, legacySource, newSource = void 0) {
    const wrapper = new _CompatWrapper(legacySource);
    return new Proxy(newSource ?? {}, {
      has(target, p) {
        console.log(`[COMPAT] has CALLED WITH '${p.toString()}'`);
        return target[p] !== void 0 || wrapper[p] !== void 0;
      },
      get(target, p, receiver) {
        console.log(`[COMPAT] get CALLED WITH '${p.toString()}'`);
        if (typeof p === "string" && p === "initialise") {
          return async () => {
            if (info.registerHomeSectionsInInitialise) {
              await wrapper.initialise();
            }
            await target[p]?.();
          };
        }
        if (target[p]) {
          return target[p];
        } else if (wrapper[p]) {
          return wrapper[p];
        }
        return void 0;
      }
    });
  }
  return __toCommonJS(wrapper_exports);
})();
