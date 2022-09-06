import { RequestManagerProps } from "./../_exports";
import { Request } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface RequestManager extends RequestManagerProps {
    getDefaultUserAgent(): any;
    /*
    * internalName: _schedule
    */
    schedule(request: Request, retry: number): any;
}
