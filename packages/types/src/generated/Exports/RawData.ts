export interface RawData {
    readonly length: number;
    [index: number]: Byte;
    toString(): string | undefined;
}
declare global {
    namespace App {
        function createRawData(info: {
            byteArray: ByteArray
        }): RawData;
    }
}
