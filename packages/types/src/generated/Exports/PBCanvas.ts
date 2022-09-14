import { RawData } from "./../_exports";
import { PBImage } from "./../_exports";
export interface PBCanvas {
    readonly width: number;
    readonly height: number;
    /*
    * internalName: _data
    */
    readonly data?: RawData;
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
declare global {
    namespace App {
        function createPBCanvas(): PBCanvas;
    }
}
