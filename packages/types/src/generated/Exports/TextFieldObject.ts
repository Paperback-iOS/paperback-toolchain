export interface TextFieldObject {
    placeholderText: string;
}
declare global {
    function createTextFieldObject(info: TextFieldObject): TextFieldObject;
}
