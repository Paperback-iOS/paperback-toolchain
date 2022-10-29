import { SourceCookieStore } from "./../_exports";
import { SourceInterceptor } from "./../_exports";
import { Request } from "./../_exports";
import { Response } from "./../_exports";
export interface RequestManager {
    readonly cookieStore?: SourceCookieStore;
    /*
    * internalName: _interceptor
    */
    readonly interceptor?: SourceInterceptor;
    readonly requestsPerSecond: number;
    readonly requestTimeout: number;
    getDefaultUserAgent(): Promise<string>;
    /*
    * internalName: _schedule
    */
    schedule(request: Request, retry: number): Promise<Response>;
}
declare global {
    namespace App {
        function createRequestManager(info: {
            interceptor?: SourceInterceptor
            requestsPerSecond?: number
            requestTimeout?: number
        }): RequestManager;
    }
}
