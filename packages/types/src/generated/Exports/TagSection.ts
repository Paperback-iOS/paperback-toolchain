import { Tag } from "./../_exports";
export interface TagSection {
    id: string;
    label: string;
    tags: Tag[];
}
declare global {
    function createTagSection(info: TagSection): TagSection;
}
