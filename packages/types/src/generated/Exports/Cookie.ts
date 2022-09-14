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
        function createCookie(info: {
            name: string
            value: string
            domain: string
            path?: string
            created?: Date
            expires?: Date
        }): Cookie;
    }
}
