export interface IconText {
    icon?: string;
    text: string;
}
declare global {
    namespace App {
        function createIconText(info: IconText): IconText;
    }
}
