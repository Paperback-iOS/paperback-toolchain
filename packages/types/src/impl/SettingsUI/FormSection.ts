import type { FormItemElement } from './FormItemElement.js'

export interface FormSectionElement {
  id: string
  header?: string
  footer?: string
  items: FormItemElement<unknown>[]
}

export type SectionInfo = {
  id: string
  header?: string
  footer?: string
}

export function Section(
  params: string | SectionInfo,
  items: (FormItemElement<unknown> | undefined)[]
): FormSectionElement {
  let info: SectionInfo
  if (typeof params === 'string') {
    info = { id: params }
  } else {
    info = params
  }

  return {
    ...info,
    items: items.filter((x) => x) as FormItemElement<unknown>[],
  }
}

// type ListSectionProps = {
//   items: unknown
//   allowDeletion: boolean
//   onRemove: SelectorID<() => Promise<void>>
//   allowAddition: boolean
//   onAdd: SelectorID<() => Promise<void>>
//   rowBuilder: (item: unknown) => FormItemElement<unknown>
// }

// function ListSection(id: string, props: ListSectionProps) {
// TODO
// ListSection('mySection', {
//     items: [{ value: 'hello', id: 'world' }],
//     allowDeletion: true,
//     onRemove: Application.selector(this, 'myItemDidRemove'),
//     allowAddition: true,
//     onAdd: Application.selector(this, 'myItemDidAdd'),
//     rowBuilder: (element) => InputRow('myRow', {
//         id: element.id,
//         value: element.value,
//         placeholder: 'Foo'
//     })
// })
// }
