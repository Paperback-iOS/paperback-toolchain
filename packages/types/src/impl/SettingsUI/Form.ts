import type { FormSectionElement } from './FormSection.js'

export abstract class Form {
  reloadForm() {
    // @ts-expect-error hidden field
    const formId = this['__underlying_formId'] as string | undefined

    if (!formId) return

    // @ts-expect-error hidden function
    Application.formDidChange(formId)
  }

  abstract getSections(): FormSectionElement<unknown>[]

  /* Life cycle methods, always called, errors logged but ignored */
  formWillAppear?(): void
  formDidAppear?(): void
  formWillDisappear?(): void
  formDidDisappear?(): void

  /**
   * When this is true, the app enables the `Submit` and `Cancel` buttons
   * that call {@link Form.formDidSubmit} and {@link Form.formDidCancel} respectively
   * 
   * Notes: updating this after the form appears requires a call to {@link Form.reloadForm}
   */
  readonly requiresExplicitSubmission: boolean = false

  /**
   * The app calls this method when the user presses `Submit`.
   * Throw an error here to halt the dismissal and display an alert popup
   */
  formDidSubmit?(): Promise<void>

  /**
   * The app calls this method when the user presses `Cancel`.
   * Errors thrown from here are logged without blocking dismissal
   */
  formDidCancel?(): void
}
