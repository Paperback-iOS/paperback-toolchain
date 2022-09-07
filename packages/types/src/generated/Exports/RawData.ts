export interface RawDataProps {
    readonly length: number;
}
export interface RawData extends RawDataProps {
    toString(): string | undefined;
}
declare global {
    function createRawData(info: RawDataProps): RawData;
}
