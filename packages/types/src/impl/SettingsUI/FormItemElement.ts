import type { Cookie } from '../../Cookie.js'
import type { Request } from '../../Request.js'
import { closureSelector, type SelectorID } from '../Selector.js'
import { Form } from './Form.js'
import { FlowSection, Section } from './FormSection.js'

export interface FormItemElement<T> {
  id: string
  type: T
  isHidden: boolean
}

type TypedRowElement<T, P> = FormItemElement<T> & P

type LabelRowElement = TypedRowElement<'labelRow', LabelRowProps & { isSelectable: boolean }>
type OAuthButtonRowElement = TypedRowElement<
  'oauthButtonRow',
  OAuthButtonRowProps
>
type NavigationRowElement = TypedRowElement<'navigationRow', NavigationRowProps>
type ButtonRowElement = TypedRowElement<'buttonRow', ButtonRowProps>
type SelectRowElement = TypedRowElement<'selectRow', SelectRowProps>
type ToggleRowElement = TypedRowElement<'toggleRow', ToggleRowProps>
type InputRowElement = TypedRowElement<'inputRow', InputRowProps>
type StepperRowElement = TypedRowElement<'stepperRow', StepperRowProps>
type WebViewRowElement = TypedRowElement<'webViewRow', WebViewRowProps>

export type LabelRowProps = {
  title: string
  subtitle?: string
  value?: string
  isHidden?: boolean
  onSelect?: SelectorID<() => Promise<void>>
}

export function LabelRow(id: string, props: LabelRowProps): LabelRowElement {
  return { ...props, id, type: 'labelRow', isHidden: props.isHidden ?? false, isSelectable: props.onSelect != undefined }
}

export type InputRowProps = {
  title: string
  value: string
  isSecureEntry?: boolean
  isHidden?: boolean
  onValueChange: SelectorID<(value: string) => Promise<void>>
}

export function InputRow(id: string, props: InputRowProps): InputRowElement {
  return { ...props, id, type: 'inputRow', isHidden: props.isHidden ?? false }
}

export type StepperRowProps = {
  title: string
  subtitle?: string

  value: number

  minValue: number
  maxValue: number
  stepValue: number
  loopOver: boolean

  isHidden?: boolean

  onValueChange: SelectorID<(value: number) => Promise<void>>
}

export function StepperRow(
  id: string,
  props: StepperRowProps
): StepperRowElement {
  return {
    ...props,
    id,
    type: 'stepperRow',
    isHidden: props.isHidden ?? false,
  }
}

export type ToggleRowProps = {
  title: string
  subtitle?: string
  value: boolean
  isHidden?: boolean
  onValueChange: SelectorID<(value: boolean) => Promise<void>>
}

export function ToggleRow(id: string, props: ToggleRowProps): ToggleRowElement {
  return { ...props, id, type: 'toggleRow', isHidden: props.isHidden ?? false }
}

export type SelectRowProps = {
  title: string
  subtitle?: string
  value: string[]
  minItemCount: number
  maxItemCount: number
  options: { id: string; title: string }[]
  isHidden?: boolean
  onValueChange: SelectorID<(value: string[]) => Promise<void>>
}

export function SelectRow(id: string, props: SelectRowProps): SelectRowElement {
  return { ...props, id, type: 'selectRow', isHidden: props.isHidden ?? false }
}

export type TriStateSelectRowProps = {
  title: string,
  isHidden?: boolean,

  layout: 'flow' | 'list',
  value: Record<string, 'included' | 'excluded'>,
  items: { id: string, title: string }[],
  allowExclusion: boolean,
  allowEmptySelection: boolean,
  maximum?: number,
  onValueChange: SelectorID<(value: Record<string, 'included' | 'excluded'>) => Promise<void>>
}

export function TriStateSelectRow(id: string, props: TriStateSelectRowProps): NavigationRowElement {
  return NavigationRow(id, {
    form: new TriStateSelectForm(props.title, props),
    title: props.title,
    value: `${Object.keys(props.value).length} items`,
    isHidden: props.isHidden,
  })
}

export type ButtonRowProps = {
  title: string
  isHidden?: boolean
  onSelect: SelectorID<() => Promise<void>>
}

export function ButtonRow(id: string, props: ButtonRowProps): ButtonRowElement {
  return { ...props, id, type: 'buttonRow', isHidden: props.isHidden ?? false }
}

export type WebViewRowProps = {
  title: string
  request: Request
  isHidden?: boolean
  onComplete: SelectorID<(cookies: Cookie[]) => Promise<void>>
  onCancel: SelectorID<() => Promise<void>>
}

export function WebViewRow(
  id: string,
  props: WebViewRowProps
): WebViewRowElement {
  return {
    ...props,
    id,
    type: 'webViewRow',
    isHidden: props.isHidden ?? false,
  }
}

export type NavigationRowProps = {
  title: string
  subtitle?: string
  value?: string
  isHidden?: boolean
  form: Form
}

export function NavigationRow(
  id: string,
  props: NavigationRowProps
): NavigationRowElement {
  return {
    ...props,
    id,
    type: 'navigationRow',
    isHidden: props.isHidden ?? false,
  }
}

export type OAuthButtonRowProps = {
  title: string
  subtitle?: string

  onSuccess: SelectorID<
    (refreshToken: string, accessToken: string) => Promise<void>
  >
  authorizeEndpoint: string
  responseType:
  | {
    type: 'token'
  }
  | {
    type: 'code'
    tokenEndpoint: string
  }
  | {
    type: 'pkce'
    tokenEndpoint: string
    pkceCodeLength: number
    pkceCodeMethod: 'S256' | 'plain'
    formEncodeGrant: boolean
  }
  clientId?: string
  redirectUri?: string
  scopes?: string[]

  isHidden?: boolean
}

export function OAuthButtonRow(
  id: string,
  props: OAuthButtonRowProps
): OAuthButtonRowElement {
  return {
    ...props,
    id,
    type: 'oauthButtonRow',
    isHidden: props.isHidden ?? false,
  }
}

export function DeferredItem<V, T extends FormItemElement<V>>(work: () => T): T
export function DeferredItem<V, T extends FormItemElement<V>>(
  work: () => T | undefined
): T | undefined {
  return work()
}

class TriStateSelectForm extends Form {
  states: Record<string, 'included' | 'excluded'> = {}

  constructor(
    public title: string,
    public params: TriStateSelectRowProps
  ) {
    super()

    // Make a copy
    this.states = { ...params.value }
  }

  override requiresExplicitSubmission: boolean = true

  override getSections() {
    const selectedOptionsLength = Object.keys(this.states).length

    return [
      (this.params.layout == 'flow' ? FlowSection : Section)(
        { id: 'multiselect', header: this.title },
        this.params.items.map(item => {
          const currentState = this.states[item.id]

          let value: string | undefined
          let style: 'success' | 'error' | undefined
          switch (currentState) {
            case 'included': {
              value = "✓"
              if (this.params.layout == 'flow') {
                style = 'success'
              }
              break
            }
            case 'excluded': {
              value = "✕"
              if (this.params.layout == 'flow') {
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
            onSelect: closureSelector(this, item.id, async () => {
              let nextState: 'included' | 'excluded' | undefined
              const canSelect = !this.params.maximum || selectedOptionsLength < this.params.maximum
              const canDeselect = (this.params.allowEmptySelection && selectedOptionsLength == 1) || selectedOptionsLength > 1

              switch (currentState) {
                case 'included': {
                  if (this.params.allowExclusion) {
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
                delete this.states[item.id]
              } else {
                this.states[item.id] = nextState
              }

              this.reloadForm()
            })
          })
        })
      )
    ]
  }

  override async formDidSubmit(): Promise<void> {
    Application.SelectorRegistry.selector(this.params.onValueChange)(this.states)
  }
}