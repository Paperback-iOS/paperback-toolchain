import { RawData } from "./../_exports";
export interface PBImage {
    readonly width: number;
    readonly height: number;
    /*
    * internalName: _data
    */
    readonly data?: RawData;
}
declare global {
    function createPBImage(info: PBImage): PBImage;
}
