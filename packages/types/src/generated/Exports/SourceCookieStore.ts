import { Cookie } from "./../_exports";
export interface SourceCookieStore {
    getAllCookies(): Cookie[];
    addCookie(cookies: Cookie): void;
    removeCookie(cookie: Cookie): void;
}
