export interface Tag {
    id: string;
    label: string;
}
declare global {
    namespace App {
        function createTag(info: Tag): Tag;
    }
}
