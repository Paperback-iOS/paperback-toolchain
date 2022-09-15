import { TagSection } from "./../_exports";
export interface MangaInfo {
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
declare global {
    namespace App {
        function createMangaInfo(info: {
            image: string
            artist?: string
            author?: string
            desc: string
            status: string
            hentai?: boolean
            titles: string[]
            banner?: string
            rating?: number
            tags?: TagSection[]
            covers?: string[]
            additionalInfo?: Record<string, string>
        }): MangaInfo;
    }
}
