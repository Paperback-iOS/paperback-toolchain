import { DiscoverSection } from "../../generated/_exports";
import { DiscoverSectionItem } from "../DiscoverSectionItem";
import { PagedResults } from "../PagedResults";

export interface DiscoverSectionProviding {
    getDiscoverSections(): Promise<DiscoverSection[]>
    getDiscoverSectionItems(section: DiscoverSection, metadata: unknown | undefined): Promise<PagedResults<DiscoverSectionItem>>
}
