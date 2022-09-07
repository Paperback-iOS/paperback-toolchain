import { Cookie } from "./../_exports";
export interface Request {
    url: string;
    method: string;
    headers: Record<string, string>;
    data?: any;
    param?: string;
    cookies: Cookie[];
    incognito: boolean;
}
declare global {
    function createRequest(info: Request): Request;
}
