import type { DiscoverSectionType } from './DiscoverSectionType.js'

export interface DiscoverSection {
  readonly id: string
  readonly title: string
  readonly subtitle?: string
  readonly type: DiscoverSectionType
}
