export interface DUIForm {
}
declare global {
    namespace App {
        function createDUIForm(info: DUIForm): DUIForm;
    }
}
