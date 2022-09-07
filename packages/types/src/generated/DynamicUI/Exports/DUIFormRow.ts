export interface DUIFormRow {
    readonly id: string;
}
declare global {
    function createDUIFormRow(info: DUIFormRow): DUIFormRow;
}
