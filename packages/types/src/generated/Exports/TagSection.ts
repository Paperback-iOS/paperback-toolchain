import { Tag } from "./../_exports";
export interface TagSection {
    readonly id: string;
    label: string;
    tags: Tag[];
}
declare global {
    namespace App {
        function createTagSection(info: {
            id: string
            label: string
            tags: Tag[]
        }): TagSection;
    }
}
