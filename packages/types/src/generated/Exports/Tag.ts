export interface Tag {
    id: string;
    label: string;
}
declare global {
    function createTag(info: Tag): Tag;
}
