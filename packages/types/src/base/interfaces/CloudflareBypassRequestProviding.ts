import { RequestManagerProviding, Request } from "../..";

export interface CloudflareBypassRequestProviding extends RequestManagerProviding {
  /**
   * If a source is secured by Cloudflare, this method should be filled out.
   * By returning a request to the website, this source will attempt to create a session
   * so that the source can load correctly.
   * Usually the {@link Request} url can simply be the base URL to the source.
   */
	getCloudflareBypassRequestAsync(): Promise<Request>
}