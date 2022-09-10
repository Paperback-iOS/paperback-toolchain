export interface RawDataProps {
    readonly length: number;
    [index: number]: Byte;
}
export interface RawData extends RawDataProps {
    toString(): string | undefined;
}
declare global {
    namespace App {
        function createRawData(info: RawDataProps): RawData;
    }
}
