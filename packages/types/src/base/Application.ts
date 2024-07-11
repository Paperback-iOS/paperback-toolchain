import { DiscoverSection, DiscoverSectionItem, PagedResults, Request, Response, SearchFilter } from ".."

export { }

type RequestInterceptor = (request: Request) => Promise<Request>
type ResponseInterceptor = (
    request: Request,
    response: Response,
    data: ArrayBuffer,
) => Promise<ArrayBuffer>

declare global {
    namespace Application {
        // Global
        function decodeHTMLEntities(str: string): string
        function sleep(seconds: number): Promise<void>


        // Discover Section
        function registeredDiscoverSections(): DiscoverSection[]
        function registerDiscoverSection(
            section: DiscoverSection,
            selector: SelectorID<(section: DiscoverSection, metadata: any | undefined) => Promise<PagedResults<DiscoverSectionItem>>>
        ): void
        function unregisterDiscoverSection(sectionId: string): void


        // Request Manager
        function registerInterceptor(
            interceptorId: String,
            interceptRequestSelectorId: SelectorID<RequestInterceptor>,
            interceptResponseSelectorId: SelectorID<ResponseInterceptor>,
        ): void
        function unregisterInterceptor(interceptorId: String): void
        function getDefaultUserAgent(): Promise<string>
        function scheduleRequest(request: Request): Promise<[Response, ArrayBuffer]>


        // Raw Data
        function arrayBufferToUTF8String(arrayBuffer: ArrayBuffer): string
        function arrayBufferToASCIIString(arrayBuffer: ArrayBuffer): string
        function arrayBufferToUTF16String(arrayBuffer: ArrayBuffer): string


        // Search Filters
        function registerSearchFilter(searchFilter: SearchFilter): void
        function unregisterSearchFilter(id: String): void
        function registeredSearchFilters(): SearchFilter[]


        // State Manager
        function getState(key: String): unknown | undefined
        function setState(value: unknown, key: String): void
        function getSecureState(key: String): unknown | undefined
        function setSecureState(value: unknown, key: String): void
    }
}