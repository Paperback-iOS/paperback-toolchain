import { SourceCookieStore } from "./../_exports";
import { Request } from "./../_exports";
export interface RequestManagerProps {
    readonly cookieStore?: SourceCookieStore;
    readonly requestsPerSecond: number;
    readonly requestTimeout: number;
}
export interface RequestManager extends RequestManagerProps {
    getDefaultUserAgent(): any;
    /*
    * internalName: _schedule
    */
    schedule(request: Request, retry: number): any;
}
declare global {
    function createRequestManager(info: RequestManagerProps): RequestManager;
}
