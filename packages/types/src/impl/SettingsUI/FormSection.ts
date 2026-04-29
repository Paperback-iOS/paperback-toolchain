import { closureSelector, type SelectorID } from '../Selector.js'
import { Form } from './Form.js'
import { LabelRow, type FormItemElement } from './FormItemElement.js'

export interface FormSectionElement<T> {
  type: T
  id: string
  header?: string
  footer?: string
  items: FormItemElement<unknown>[]
}

export type FlowSectionElement = FormSectionElement<'flowSection'>
export type ListSectionElement = FormSectionElement<'listSection'> & {
  allowDeletion: boolean
  allowAddition: boolean
  allowReorder: boolean

  onReorder?: SelectorID<(srcIndex: number, destIndex: number) => Promise<void>>
  onDeletion?: SelectorID<(index: number) => Promise<void>>
  onAddition?: SelectorID<() => Promise<void>>
}

export type ListSectionInfo = {
  id: string
  header?: string
  footer?: string
}

export function Section(
  params: string | ListSectionInfo,
  items: (FormItemElement<unknown> | undefined)[]
): ListSectionElement {
  let info: ListSectionInfo
  if (typeof params === 'string') {
    info = { id: params }
  } else {
    info = params
  }

  return {
    type: 'listSection',
    ...info,
    items: items.filter((x) => x) as FormItemElement<unknown>[],
    allowAddition: false, allowDeletion: false, allowReorder: false
  }
}

export type EditSectionInfo = ListSectionInfo & {
  items: (FormItemElement<unknown> | undefined)[]

  allowDeletion?: boolean
  allowAddition?: boolean
  allowReorder?: boolean

  onReorder?: SelectorID<(srcIndex: number, destIndex: number) => Promise<void>>
  onDeletion?: SelectorID<(index: number) => Promise<void>>
  onAddition?: SelectorID<() => Promise<void>>
}

export function EditSection(
  id: string,
  params: EditSectionInfo,
): ListSectionElement {
  return {
    id, type: 'listSection',
    header: params.header,
    footer: params.footer,

    allowAddition: params.onAddition != undefined && !params.allowAddition,
    allowDeletion: params.onDeletion != undefined && !params.allowDeletion,
    allowReorder: params.onReorder != undefined && !params.allowReorder,

    onAddition: params.onAddition,
    onDeletion: params.onDeletion,
    onReorder: params.onReorder,

    items: params.items.filter((x) => x) as FormItemElement<unknown>[],
  }
}

export function FlowSection(
  params: string | ListSectionInfo,
  items: (FormItemElement<unknown> | undefined)[]
): FlowSectionElement {
  let info: ListSectionInfo
  if (typeof params === 'string') {
    info = { id: params }
  } else {
    info = params
  }

  return {
    type: 'flowSection',
    ...info,
    items: items.filter((x) => x) as FormItemElement<unknown>[]
  }
}