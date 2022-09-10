export interface DUISection {
}
declare global {
    namespace App {
        function createDUISection(info: DUISection): DUISection;
    }
}
