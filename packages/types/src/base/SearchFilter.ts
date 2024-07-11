
interface DropdownSearchFilter {
    id: string
    title: string
    type: 'dropdown'
    options: {id: string, value: string}[]
    value: string
}

interface SelectSearchFilter {
    id: string
    title: string
    type: 'multiselect'
    options: {id: string, value: string}[]
    value: Record<string, 'included' | 'excluded'>
    allowExclusion: boolean
}

interface InputSearchFilter {
    id: string
    title: string
    type: 'input'
    placeholder: string
    value: string
}

export type SearchFilter = DropdownSearchFilter | SelectSearchFilter | InputSearchFilter