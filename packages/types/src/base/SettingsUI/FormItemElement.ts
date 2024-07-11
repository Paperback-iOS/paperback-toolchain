import { Form } from "./Form"

type LabelRowProps = {
    title: string
    subtitle?: string
    value?: string
    isHidden?: boolean
}

export function LabelRow(id: string, props: LabelRowProps): Application.LabelRowElement {
    return { ...props, id, type: 'labelRow', isHidden: props.isHidden ?? false}
}

type InputRowProps = {
    title: string
    value: string
    isHidden?: boolean
    onValueChange: SelectorID<(value: string) => Promise<void>>
}

export function InputRow(id: string, props: InputRowProps): Application.InputRowElement {
    return { ...props, id, type: 'inputRow', isHidden: props.isHidden ?? false}
}

type ToggleRowProps = {
    title: string
    value: boolean
    isHidden?: boolean
    onValueChange: SelectorID<(value: boolean) => Promise<void>>
}

export function ToggleRow(id: string, props: ToggleRowProps): Application.ToggleRowElement {
    return { ...props, id, type: 'toggleRow', isHidden: props.isHidden ?? false}
}

type SelectRowProps = {
    title: string
    subtitle?: string
    value: string[]
    minItemCount: number
    maxItemCount: number
    options: {id: string, title: string}[]
    isHidden?: boolean
    onValueChange: SelectorID<(value: string[]) => Promise<void>>
}

export function SelectRow(id: string, props: SelectRowProps): Application.SelectRowElement {
    return { ...props, id, type: 'selectRow', isHidden: props.isHidden ?? false}
}

type ButtonRowProps = {
    title: string
    isHidden?: boolean
    onSelect: SelectorID<() => Promise<void>>
}

export function ButtonRow(id: string, props: ButtonRowProps): Application.ButtonRowElement {
    return { ...props, id, type: 'buttonRow', isHidden: props.isHidden ?? false}
}

type NavigationRowProps = {
    title: string
    subtitle?: string
    value?: string
    isHidden?: boolean
    form: Form
}

export function NavigationRow(id: string, props: NavigationRowProps): Application.NavigationRowElement {
    return { ...props, id, type: 'navigationRow', isHidden: props.isHidden ?? false}
}

type OAuthButtonRowProps = {
    title: string
    subtitle?: string

    onSuccess: SelectorID<(refreshToken: string, accessToken: string) => Promise<void>>
    authorizeEndpoint: string
    responseType: { 
        type: 'token'
    } | {
        type: 'code'
        tokenEndpoint: string
    } | {
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

export function OAuthButtonRow(id: string, props: OAuthButtonRowProps): Application.OAuthButtonRowElement {
    return { ...props, id, type: 'oauthButtonRow', isHidden: props.isHidden ?? false }
}

export function DeferredItem<T extends Application.FormItemElement<any>>(work: () => T): T;
export function DeferredItem<T extends Application.FormItemElement<any>>(work: () => T | undefined): T | undefined {
    return work()
}

declare global {
    namespace Application {
        interface FormItemElement<T> {
            id: string
            type: T
            isHidden: boolean
        }

        type LabelRowElement = FormItemElement<'labelRow'> & LabelRowProps
        type OAuthButtonRowElement = FormItemElement<'oauthButtonRow'> & OAuthButtonRowProps
        type NavigationRowElement = FormItemElement<'navigationRow'> & NavigationRowProps
        type ButtonRowElement = FormItemElement<'buttonRow'> & ButtonRowProps
        type SelectRowElement = FormItemElement<'selectRow'> & SelectRowProps
        type ToggleRowElement = FormItemElement<'toggleRow'> & ToggleRowProps
        type InputRowElement = FormItemElement<'inputRow'> & InputRowProps
    }
}
