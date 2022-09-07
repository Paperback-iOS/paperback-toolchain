export interface SourceItem {
    label: string;
    /*
    * internalName: _type
    */
    type: string;
}
declare global {
    function createSourceItem(info: SourceItem): SourceItem;
}
