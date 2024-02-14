export interface RawData {
    readonly length: number
    [index: number]: Byte
    toString(): string | undefined
}
declare global {
    namespace Paperback {
        function createRawData(byteArray: ByteArray): RawData
    }
}
