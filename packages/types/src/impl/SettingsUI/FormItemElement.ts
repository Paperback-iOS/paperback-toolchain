import type { Cookie } from '../../Cookie.js'
import type { Request } from '../../Request.js'
import type { SelectorID } from '../Selector.js'
import { Form } from './Form.js'

export interface FormItemElement<T> {
  id: string
  type: T
  isHidden: boolean
}

type TypedRowElement<T, P> = FormItemElement<T> & P

type LabelRowElement = TypedRowElement<'labelRow', LabelRowProps>
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
}

export function LabelRow(id: string, props: LabelRowProps): LabelRowElement {
  return { ...props, id, type: 'labelRow', isHidden: props.isHidden ?? false }
}

export type InputRowProps = {
  title: string
  value: string
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
