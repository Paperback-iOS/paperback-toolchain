import { Form } from "./SettingsUI/Form";

/**
 * Represents the state of a form field with type-safe value management and selector integration.
 * @template T The type of the form field value
 */
class FormState<T> {
  private _value: T;
  private _selector: SelectorID<(value: T) => Promise<void>>;

  /**
   * Creates a new FormState instance.
   * @param {Form} form - The parent form instance
   * @param {T} initialValue - The initial value of the form field
   */
  constructor(private form: Form, initialValue: T) {
    this._value = initialValue;
    this._selector = Application.Selector(this as FormState<T>, "updateValue");
  }

  /**
   * Gets the current value of the form field.
   * @returns {T} The current value
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Gets the selector ID for the update function.
   * @returns {SelectorID<(value: T) => Promise<void>>} The selector ID
   */
  public get selector(): SelectorID<(value: T) => Promise<void>> {
    return this._selector;
  }

  /**
   * Updates the form field value and triggers a form reload.
   * @param {T} value - The new value to set
   * @returns {Promise<void>} A promise that resolves when the update is complete
   */
  public async updateValue(value: T): Promise<void> {
    this._value = value;
    this.form.reloadForm();
  }
}

/**
 * Creates a tuple containing getter, setter, and selector for managing form state.
 * This function simplifies form state management by providing a consistent interface
 * for reading, writing, and binding form values.
 * 
 * @template T The type of the form field value
 * @param {Form} form - The parent form instance
 * @param {T} initialValue - The initial value of the form field
 * @returns {[
 *   () => T,
 *   (value: T) => Promise<void>,
 *   SelectorID<(value: T) => Promise<void>>
 * ]} A tuple containing:
 *   - A getter function that returns the current value
 *   - A setter function that updates the value and triggers a form reload
 *   - A selector ID for binding the update function
 * 
 * @example
 * // Initialize form state with a number value
 * const [getValue, setValue, mySelector] = createFormState(this, 0);
 * 
 * // Read the current value
 * const currentValue = getValue();
 * 
 * // Update the value
 * await setValue(5);
 * 
 * // Use the selector for binding
 * InputRow("test", {
 *   title: "Test Row",
 *   value: getValue(),
 *   onValueChange: mySelector
 * });
 */
export function createFormState<T>(
  form: Form,
  initialValue: T
): [
  () => T,
  (value: T) => Promise<void>,
  SelectorID<(value: T) => Promise<void>>
] {
  const state = new FormState(form, initialValue);
  return [() => state.value, state.updateValue.bind(state), state.selector];
}
