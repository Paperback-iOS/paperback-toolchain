import type { DiscoverSectionItem } from '../DiscoverSectionItem.js'
import type { DiscoverSection } from '../HomeSection.js'
import type { PagedResults } from '../PagedResults.js'
import type {
  Request,
  RequestInterceptor,
  RedirectHandler,
} from '../Request.js'
import type { Response, ResponseInterceptor } from '../Response.js'
import type { Cookie } from '../Cookie.js'
import type { SelectorID, SelectorRegistry, KeyOfType } from './Selector.js'
import type { Metadata } from '../Metadata.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Application {
    // Global
    const isResourceLimited: boolean

    const filterAdultTitles: boolean
    const filterMatureTitles: boolean

    function decodeHTMLEntities(str: string): string
    function sleep(seconds: number): Promise<void>

    // Discover Section
    /**
     * @description If sections are registered using this method the app will not call {@link DiscoverSectionProviding.getDiscoverSections} unless {@link Application.invalidateDiscoverSections} is called.
     * @param section The discover section to register.
     * @param selector Optional. If provided, the app will call the method, otherwise defaults to {@link DiscoverSectionProviding.getDiscoverSectionItems}
     * @deprecated register sections in {@link DiscoverSectionProviding.getDiscoverSections} by implementing {@link DiscoverSectionProviding}
     */
    function registerDiscoverSection(
      section: DiscoverSection,
      selector?: SelectorID<
        (
          section: DiscoverSection,
          metadata: Metadata
        ) => Promise<PagedResults<DiscoverSectionItem>>
      >
    ): void
    function unregisterDiscoverSection(sectionId: string): void
    function registeredDiscoverSections(): DiscoverSection[]
    /** Invalidate discover section cache (removes all discover sections) */
    function invalidateDiscoverSections(): void

    // Request Manager
    function registerInterceptor(
      interceptorId: string,
      interceptRequestSelectorId: SelectorID<RequestInterceptor>,
      interceptResponseSelectorId: SelectorID<ResponseInterceptor>
    ): void
    function unregisterInterceptor(interceptorId: string): void
    function setRedirectHandler(
      redirectHandlerSelectorId: SelectorID<RedirectHandler>
    ): void
    function getDefaultUserAgent(): Promise<string>
    function scheduleRequest(request: Request): Promise<[Response, ArrayBuffer]>

    // Raw Data
    function arrayBufferToUTF8String(arrayBuffer: ArrayBuffer): string
    function arrayBufferToASCIIString(arrayBuffer: ArrayBuffer): string
    function arrayBufferToUTF16String(arrayBuffer: ArrayBuffer): string

    /**
     * encodes the given input into base64
     * @param value a string or array buffer to encode
     * @returns utf8 string if valid (input data was not binary), otherwise array buffer
     */
    function base64Encode(value: string | ArrayBuffer): string | ArrayBuffer

    /**
     * decodes the given input as base64
     * @param value a base64 encoded string or array buffer
     * @returns utf8 string if valid (input data was not binary), otherwise array buffer
     */
    function base64Decode(value: string | ArrayBuffer): string | ArrayBuffer

    /**
     * hashes the given input using md5
     * @param value an array buffer or string to hash
     * @returns an md5 hash of the given input
     */
    function crypto_md5Hash(value: string | ArrayBuffer): string

    // State Manager
    function getSecureState(key: string): unknown | undefined
    function setSecureState(value: unknown, key: string): void
    function getState(key: string): unknown | undefined
    function setState(value: unknown, key: string): void
    /**
     * Clears all saved state.
     *
     * *Note: Does not clear secure state.*
     */
    function resetAllState(): void

    // Webview
    type ExecuteInWebViewContext = {
      source: {
        html: string
        baseUrl: string
        loadCSS: boolean
        loadImages: boolean
      }
      inject: string
      storage: { cookies: Cookie[] }
      captureConsoleLog?: boolean
    }

    type WebViewExecutionResult = {
      result: unknown
      storage: { cookies: Cookie[] }
    }

    function executeInWebView(
      context: ExecuteInWebViewContext
    ): Promise<WebViewExecutionResult>

    // Selector
    const SelectorRegistry: SelectorRegistry

    function Selector<T extends object, K>(
      obj: T,
      symbol: KeyOfType<T, K>
    ): SelectorID<K>
  }
}
