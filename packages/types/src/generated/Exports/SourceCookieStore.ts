import { Cookie } from "./../_exports";
export interface SourceCookieStoreProps {
}
export interface SourceCookieStore extends SourceCookieStoreProps {
    getAllCookies(): Cookie[];
    addCookie(cookies: Cookie): void;
    removeCookie(cookie: Cookie): void;
}
declare global {
    function createSourceCookieStore(info: SourceCookieStoreProps): SourceCookieStore;
}
