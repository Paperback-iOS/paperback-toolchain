import type { Form } from '../SettingsUI/Form.js'

export interface SettingsFormProviding {
  getSettingsForm(): Promise<Form>
}
