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

export type TriStateSelectSectionInfo = ListSectionInfo & {
  layout: 'flow' | 'list',
  value: Record<string, 'included' | 'excluded'>,
  items: { id: string, title: string }[],
  allowExclusion: boolean,
  allowEmptySelection: boolean,
  maximum?: number,
  onValueChange?: SelectorID<() => Promise<void>>
}

export function TriStateSelectSection(
  form: Form,
  params: TriStateSelectSectionInfo
) {
  const selectedOptionsLength = Object.keys(params.value).length

  return (params.layout == 'flow' ? FlowSection : Section)(
    { id: params.id, header: params.header, footer: params.footer },
    params.items.map(item => {
      const currentState = params.value[item.id]

      let value: string | undefined
      let style: 'success' | 'error' | undefined
      switch (currentState) {
        case 'included': {
          value = "✓"
          if (params.layout == 'flow') {
            style = 'success'
          }
          break
        }
        case 'excluded': {
          value = "✕"
          if (params.layout == 'flow') {
            style = 'error'
          }
          break
        }
        default: {
          value = undefined
          style = undefined
          break
        }
      }

      return LabelRow(item.id, {
        // @ts-expect-error not implemented in the app yet
        style,
        title: item.title, value,
        onSelect: closureSelector(form, `__multiselect_${params.id}#${item.id}`, async () => {
          let nextState: 'included' | 'excluded' | undefined
          const canSelect = !params.maximum || selectedOptionsLength < params.maximum
          const canDeselect = (params.allowEmptySelection && selectedOptionsLength == 1) || selectedOptionsLength > 1

          switch (currentState) {
            case 'included': {
              if (params.allowExclusion) {
                nextState = 'excluded'
                break
              }

              if (canDeselect) {
                nextState = undefined
                break
              } else {
                return
              }
            }
            case 'excluded': {
              if (canDeselect) {
                nextState = undefined
                break
              } else {
                return
              }
            }
            case undefined: {
              if (canSelect) {
                nextState = 'included'
                break
              } else {
                return
              }
            }
          }

          if (nextState == undefined) {
            delete params.value[item.id]
          } else {
            params.value[item.id] = nextState
          }

          if (params.onValueChange) {
            await Application.SelectorRegistry.selector(params.onValueChange)()
          }

          form.reloadForm()
        })
      })
    })
  )
}