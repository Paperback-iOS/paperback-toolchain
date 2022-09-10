import { Request } from "./../_exports";
import { Response } from "./../_exports";
export interface SourceInterceptorProps {
}
export interface SourceInterceptor extends SourceInterceptorProps {
    /*
    * internalName: _interceptRequest
    */
    interceptRequest(request: Request): Promise<Request>;
    /*
    * internalName: _interceptResponse
    */
    interceptResponse(response: Response): Promise<Response>;
}
declare global {
    namespace App {
        function createSourceInterceptor(info: SourceInterceptorProps): SourceInterceptor;
    }
}
