import type { DiscoverSectionItem } from '../../DiscoverSectionItem.js'
import type { DiscoverSection } from '../../HomeSection.js'
import type { Metadata } from '../../Metadata.js'
import type { PagedResults } from '../../PagedResults.js'

export interface DiscoverSectionProviding {
  getDiscoverSections(): Promise<DiscoverSection[]>
  getDiscoverSectionItems(
    section: DiscoverSection,
    metadata?: Metadata
  ): Promise<PagedResults<DiscoverSectionItem>>
}
