
export function Section(id: string, items: (Application.FormItemElement<any> | undefined)[]): Application.FormSectionElement {
    return { id, items: items.filter(x => x) as Application.FormItemElement<any>[] }
}

declare global {
    namespace Application {
        interface FormSectionElement {
            id: string
            items: FormItemElement<any>[]
        }
    }
}