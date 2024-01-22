import { DiscoverSection, PagedResults, Request, Response } from ".."

export {}

declare global {
	namespace Application {
		// Global
		function decodeHTMLEntities(str: string): string


		// Discover Section
		function registeredDiscoverSections(): DiscoverSection[]
		function registerDiscoverSection(
			section: DiscoverSection,
			selector: SelectorID<(metadata: unknown) => Promise<PagedResults<unknown>>>
		): void
		function unregisterDiscoverSection(sectionId: string): void


		// Request Manager
		function registerInterceptor(
			interceptorId: String,
			interceptRequestSelectorId: SelectorID<
				(request: Request) => Promise<Request>
			>,
			interceptResponseSelectorId: SelectorID<
				(
					request: Request,
					response: Response,
					data: ArrayBuffer,
				) => Promise<ArrayBuffer>
			>,
		): void
		function getDefaultUserAgent(): Promise<string>
		function scheduleRequest(request: Request): Promise<[Response, ArrayBuffer]>


		// Raw Data
		function arrayBufferToUTF8String(arrayBuffer: ArrayBuffer): string
		function arrayBufferToASCIIString(arrayBuffer: ArrayBuffer): string
		function arrayBufferToUTF16String(arrayBuffer: ArrayBuffer): string
	}
}
