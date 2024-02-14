import { DiscoverSectionType } from "../../DiscoverSectionType"

export interface DiscoverSection {
    readonly id: string
    readonly title: string
    readonly subtitle?: string
    readonly type: DiscoverSectionType
}