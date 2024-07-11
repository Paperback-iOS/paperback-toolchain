export abstract class Form {
    reloadForm() {
        // @ts-expect-error
        const formId = this['__underlying_formId'] as string | undefined

        if(!formId) return

        // @ts-expect-error
        Application.formDidChange(formId)
    }

    abstract getSections(): Application.FormSectionElement[]
}