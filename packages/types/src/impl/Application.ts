import type { DiscoverSectionItem } from '../DiscoverSectionItem.js'
import type { DiscoverSection } from '../HomeSection.js'
import type { PagedResults } from '../PagedResults.js'
import type { SearchFilter } from '../SearchFilter.js'
import type {
  Request,
  RequestInterceptor,
  RedirectHandler,
} from '../Request.js'
import type { Response, ResponseInterceptor } from '../Response.js'
import type { Cookie } from '../Cookie.js'
import type { SelectorID, SelectorRegistry, KeyOfType } from './Selector.js'


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
          metadata: unknown | undefined
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

    function base64Encode<T extends string | ArrayBuffer>(value: T): T
    function base64Decode<T extends string | ArrayBuffer>(value: T): T

    // Search Filters
    /**
     * @description If search filters are registered using this method the app will not call {@link SearchResultsProviding.getSearchFilters} unless {@link Application.invalidateSearchFilters} is called.
     * @deprecated register search filters in {@link SearchResultsProviding.getSearchFilters} by implementing {@link SearchResultsProviding}
     */
    function registerSearchFilter(searchFilter: SearchFilter): void
    function unregisterSearchFilter(id: string): void
    function registeredSearchFilters(): SearchFilter[]
    /** Invalidate search filter cache (removes all search filters) */
    function invalidateSearchFilters(): void

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
