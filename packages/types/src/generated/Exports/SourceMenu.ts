import { SourceMenuItem } from "./../_exports";
export interface SourceMenu {
    items: SourceMenuItem[];
}
declare global {
    function createSourceMenu(info: SourceMenu): SourceMenu;
}
