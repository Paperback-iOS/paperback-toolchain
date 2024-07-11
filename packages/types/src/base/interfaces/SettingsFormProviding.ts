import { Form } from "..";

export interface SettingsFormProviding {
    getSettingsForm(): Promise<Form>
}