import type { FormSectionElement } from './FormSection.js'

export abstract class Form {
  reloadForm() {
    // @ts-expect-error hidden field
    const formId = this['__underlying_formId'] as string | undefined

    if (!formId) return

    // @ts-expect-error hidden function
    Application.formDidChange(formId)
  }

  abstract getSections(): FormSectionElement[]

  /* Life cycle methods, always called, errors logged but ignored */
  formWillAppear?(): void
  formDidAppear?(): void
  formWillDisappear?(): void
  formDidDisappear?(): void

  // If this returns true, the app will display `Submit` and `Cancel` buttons
  // and call the relevant methods when they are pressed
  get requiresExplicitSubmission(): boolean {
    return false
  }

  // The app calls this method when the user presses `Submit`
  // Throw an error here to halt the dismissal and display an alert popup
  formDidSubmit?(): Promise<void>

  // The app calls this method when the user presses `Cancel`
  // Any errors thrown from here are ignored and the dismissal is not blocked
  formDidCancel?(): void
}
