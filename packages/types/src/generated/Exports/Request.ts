import { Cookie } from "./../_exports";
export interface Request {
    url: string;
    method: string;
    headers: Record<string, string>;
    data?: any;
    param?: string;
    cookies: Cookie[];
}
declare global {
    namespace App {
        function createRequest(info: {
            url: string
            method: string
            headers?: Record<string, string>
            param?: string
            data?: any
            cookies?: Cookie[]
        }): Request;
    }
}
