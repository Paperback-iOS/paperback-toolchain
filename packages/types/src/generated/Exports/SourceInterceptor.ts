import { Request } from "./../_exports";
import { Response } from "./../_exports";
export interface SourceInterceptor {
    /*
    * internalName: _interceptRequest
    */
    interceptRequest(request: Request): Promise<Request>;
    /*
    * internalName: _interceptResponse
    */
    interceptResponse(response: Response): Promise<Response>;
}
