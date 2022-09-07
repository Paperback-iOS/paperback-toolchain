export interface SearchField {
    readonly id: string;
    readonly name: string;
    readonly placeholder: string;
}
declare global {
    function createSearchField(info: SearchField): SearchField;
}
