import type { DiscoverSectionItem } from '../../DiscoverSectionItem.js'
import type { DiscoverSection } from '../../HomeSection.js'
import type { PagedResults } from '../../PagedResults.js'

export interface DiscoverSectionProviding {
  getDiscoverSections(): Promise<DiscoverSection[]>
  getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: unknown | undefined
  ): Promise<PagedResults<DiscoverSectionItem>>
}
