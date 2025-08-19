import {
  BadgeColor,
  ContentRating as LegacyContentRating,
  type SourceInfo as LegacySourceInfo,
} from './types.js'
import {
  ContentRating,
  type SourceBadge,
  type SourceDeveloper,
  type SourceInfo,
  type SourceIntents,
} from '../../impl/SourceInfo.js'

export class SourceInfoWrapper implements SourceInfo {
  version: string
  name: string
  icon: string
  description: string
  contentRating: ContentRating
  developers: SourceDeveloper[]
  language?: string
  badges: SourceBadge[]
  capabilities: SourceIntents | SourceIntents[]

  constructor(legacySourceInfo: LegacySourceInfo) {
    this.version = legacySourceInfo.version
    this.name = legacySourceInfo.name
    this.icon = legacySourceInfo.name
    this.description = legacySourceInfo.description

    switch (legacySourceInfo.contentRating) {
      case LegacyContentRating.EVERYONE:
        this.contentRating = ContentRating.EVERYONE
        break
      case LegacyContentRating.MATURE:
        this.contentRating = ContentRating.MATURE
        break
      case LegacyContentRating.ADULT:
        this.contentRating = ContentRating.ADULT
        break
    }

    this.developers = [
      {
        name: legacySourceInfo.author,
        ...(!legacySourceInfo.authorWebsite && {
          website: legacySourceInfo.authorWebsite,
        }),
      },
    ]

    this.badges =
      legacySourceInfo.sourceTags?.map((x) => {
        switch (x.type) {
          case BadgeColor.BLUE:
            return {
              label: x.text,
              backgroundColor: '#1E40AF',
              textColor: '#ffffff',
            }
          case BadgeColor.GREEN:
            return {
              label: x.text,
              backgroundColor: '#15803d',
              textColor: '#ffffff',
            }
          case BadgeColor.GREY:
            return {
              label: x.text,
              backgroundColor: '#1F2937',
              textColor: '#ffffff',
            }
          case BadgeColor.RED:
            return {
              label: x.text,
              backgroundColor: '#991B1B',
              textColor: '#ffffff',
            }
          case BadgeColor.YELLOW:
            return {
              label: x.text,
              backgroundColor: '#EAB308',
              textColor: '#000000',
            }
        }
      }) ?? []
    this.badges.unshift({
      label: 'LEGACY (0.8)',
      backgroundColor: '#000000',
      textColor: '#ffffff',
    })

    // @ts-expect-error bitset shenanigans
    this.capabilities = legacySourceInfo.intents ?? []
  }
}
