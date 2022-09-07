import { Request } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface RequestManager {
    getDefaultUserAgent(): any;
    /*
    * internalName: _schedule
    */
    schedule(request: Request, retry: number): any;
}
