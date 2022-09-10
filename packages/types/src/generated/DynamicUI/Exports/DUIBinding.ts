export interface DUIBinding {
}
declare global {
    namespace App {
        function createDUIBinding(info: DUIBinding): DUIBinding;
    }
}
