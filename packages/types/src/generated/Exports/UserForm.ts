import { FormObject } from "./../_exports";
export interface UserForm {
    formElements: FormObject[];
}
declare global {
    function createUserForm(info: UserForm): UserForm;
}
