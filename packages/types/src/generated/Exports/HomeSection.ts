import { PartialSourceManga } from "./../_exports";
export interface HomeSection {
    id: string;
    title: string;
    items: PartialSourceManga[];
    containsMoreItems: boolean;
}
declare global {
    function createHomeSection(info: HomeSection): HomeSection;
}
