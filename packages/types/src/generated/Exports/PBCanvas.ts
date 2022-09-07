import { RawData } from "./../_exports";
import { PBImage } from "./../_exports";
export interface PBCanvasProps {
    readonly width: number;
    readonly height: number;
    /*
    * internalName: _data
    */
    readonly data?: RawData;
}
export interface PBCanvas extends PBCanvasProps {
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
    function createPBCanvas(info: PBCanvasProps): PBCanvas;
}
