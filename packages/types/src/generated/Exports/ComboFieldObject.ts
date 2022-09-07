export interface ComboFieldObject {
    values: string[];
}
declare global {
    function createComboFieldObject(info: ComboFieldObject): ComboFieldObject;
}
