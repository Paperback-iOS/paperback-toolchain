export interface Tag {
    readonly id: string;
    readonly label: string;
}
declare global {
    namespace App {
        function createTag(info: {
            id: string
            label: string
        }): Tag;
    }
}
