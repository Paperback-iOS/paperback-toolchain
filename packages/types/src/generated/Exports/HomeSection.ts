import { PartialSourceManga } from "./../_exports";
export interface HomeSection {
    id: string;
    title: string;
    items: PartialSourceManga[];
    containsMoreItems: boolean;
}
declare global {
    namespace App {
        function createHomeSection(info: HomeSection): HomeSection;
    }
}
