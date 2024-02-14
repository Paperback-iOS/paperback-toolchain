export interface Tag {
    readonly id: string
    readonly label: string
}
declare global {
    namespace Paperback {
        function createTag(info: {
            id: string
            label: string
        }): Tag
    }
}
