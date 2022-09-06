import { SourceCookieStoreProps } from "./../_exports";
import { Cookie } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface SourceCookieStore extends SourceCookieStoreProps {
    getAllCookies(): Cookie[];
    addCookie(cookies: Cookie): void;
    removeCookie(cookie: Cookie): void;
}
