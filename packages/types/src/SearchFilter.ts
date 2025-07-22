import type { TagSection } from './TagSection.js'

type FilterOption = { id: string; value: string }

interface DropdownSearchFilter {
  type: 'dropdown'
  id: string
  title: string
  options: FilterOption[]
  value: string
}

interface SelectSearchFilter {
  type: 'multiselect'
  id: string
  title: string
  options: FilterOption[]
  value: Record<string, 'included' | 'excluded'>
  allowExclusion: boolean
  allowEmptySelection: boolean
  maximum: number | undefined
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TagSearchFilter {
  type: 'tags'
  id: string
  title: string
  sections: TagSection[]
  value: Record<string, Record<string, 'included' | 'excluded'>>
  allowExclusion: boolean
  allowEmptySelection: boolean
  maximum: number | undefined
}

interface InputSearchFilter {
  type: 'input'
  id: string
  title: string
  placeholder: string
  value: string
}

export type SearchFilter =
  | DropdownSearchFilter
  | SelectSearchFilter
  | InputSearchFilter
