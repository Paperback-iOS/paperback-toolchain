export interface SearchField {
    readonly id: string;
    readonly name: string;
    readonly placeholder: string;
}
declare global {
    namespace App {
        function createSearchField(info: {
            id: string
            name: string
            placeholder: string
        }): SearchField;
    }
}
