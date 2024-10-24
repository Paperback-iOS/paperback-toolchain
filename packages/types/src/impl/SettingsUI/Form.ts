export abstract class Form {
  reloadForm() {
    // @ts-expect-error hidden field
    const formId = this["__underlying_formId"] as string | undefined;

    if (!formId) return;

    // @ts-expect-error hidden function
    Application.formDidChange(formId);
  }

  abstract getSections(): Application.FormSectionElement[];
}
