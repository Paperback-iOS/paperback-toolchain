export interface IconText {
    icon?: string;
    text: string;
}
declare global {
    function createIconText(info: IconText): IconText;
}
