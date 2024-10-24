import type { Form } from "../SettingsUI/Form"

export interface SettingsFormProviding {
  getSettingsForm(): Promise<Form>;
}
