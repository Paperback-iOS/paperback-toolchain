export interface DUIFormRow {
    readonly id: string;
}
declare global {
    namespace App {
        function createDUIFormRow(info: DUIFormRow): DUIFormRow;
    }
}
