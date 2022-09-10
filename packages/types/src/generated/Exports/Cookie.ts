export interface Cookie {
    name: string;
    value: string;
    domain: string;
    path?: string;
    created?: Date;
    expires?: Date;
}
declare global {
    namespace App {
        function createCookie(info: Cookie): Cookie;
    }
}
