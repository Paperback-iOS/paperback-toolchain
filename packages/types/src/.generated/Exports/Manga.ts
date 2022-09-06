import { TagSection } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface Manga {
    image: string;
    artist: string;
    author: string;
    desc: string;
    status: string;
    hentai: boolean;
    titles: string[];
    banner?: string;
    /*
    * internalName: _rating
    */
    rating?: number;
    tags: TagSection[];
    covers: string[];
    avgRating: number;
    follows: number;
    langFlag: string;
    langName: string;
    users: number;
    views: number;
}
