import type { Tag } from './Tag.js'

export interface TagSection {
  readonly id: string
  title: string
  tags: Tag[]
}
