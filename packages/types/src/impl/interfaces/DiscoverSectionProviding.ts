import type { DiscoverSectionItem } from "../../DiscoverSectionItem"
import type { DiscoverSection } from "../../HomeSection"
import type { PagedResults } from "../../PagedResults"

export interface DiscoverSectionProviding {
  getDiscoverSections(): Promise<DiscoverSection[]>;
  getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: unknown | undefined,
  ): Promise<PagedResults<DiscoverSectionItem>>;
}
