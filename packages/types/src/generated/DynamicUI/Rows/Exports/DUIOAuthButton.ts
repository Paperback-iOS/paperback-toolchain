import { DUIFormRow } from "./../../../_exports";
export interface DUIOAuthButton extends DUIFormRow {
}
declare global {
    namespace App {
        function createDUIOAuthButton(info: {
            id: string
            label: string
            authorizeEndpoint: string
            clientId: string
            responseType: Record<string, any>
            redirectUri?: string
            scopes?: string[]
            successHandler: (arg0: string, arg1: string | undefined) => Promise<void>
        }): DUIOAuthButton;
    }
}
