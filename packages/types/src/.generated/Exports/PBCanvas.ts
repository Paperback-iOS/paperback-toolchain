import { PBImage } from "./../_exports";
import { RawData } from "./../_exports";
/*
* Generated from PaperbackExportCompiler
*/
export interface PBCanvas {
    /*
    * internalName: setSize
    */
    setSize(width: number, height: number): void;
    /*
    * internalName: drawImage
    */
    drawImage(pbImage: PBImage, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number): void;
    /*
    * internalName: _encode
    */
    encode(format: string): RawData | undefined;
}
