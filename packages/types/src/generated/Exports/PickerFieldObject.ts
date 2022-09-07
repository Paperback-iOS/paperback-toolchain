export interface PickerFieldObject {
    values: string[];
}
declare global {
    function createPickerFieldObject(info: PickerFieldObject): PickerFieldObject;
}
