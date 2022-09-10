export interface SearchField {
    readonly id: string;
    readonly name: string;
    readonly placeholder: string;
}
declare global {
    namespace App {
        function createSearchField(info: SearchField): SearchField;
    }
}
