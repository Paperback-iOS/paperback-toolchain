import { Cookie } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface Request {
    url: string;
    method: string;
    headers: Record<string, string>;
    data?: any;
    param?: string;
    cookies: Cookie[];
    incognito: boolean;
}
