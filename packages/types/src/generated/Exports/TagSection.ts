import { Tag } from "./../_exports";
export interface TagSection {
    id: string;
    label: string;
    tags: Tag[];
}
declare global {
    namespace App {
        function createTagSection(info: TagSection): TagSection;
    }
}
