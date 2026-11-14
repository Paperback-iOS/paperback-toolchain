import type { ContentRating } from './impl/SourceInfo.js'
import type { TagSection } from './TagSection.js'

export interface MangaInfo {
  thumbnailUrl: string
  synopsis: string
  primaryTitle: string
  secondaryTitles: string[]
  contentRating: ContentRating
  /**
   * Defaults to 'comic'
   * */
  contentType?: 'comic' | 'novel'
  /**
   * true: the title is a webtoon. The reader scrolls vertically with no page
   * padding unless the user set those on the title. Defaults to false.
   */
  isWebtoon?: boolean

  status?: string
  artist?: string
  author?: string
  bannerUrl?: string
  rating?: number
  tagGroups?: TagSection[]
  artworkUrls?: string[]
  /**
   * Shown as a two column list on the title page, sorted by key
   */
  additionalInfo?: Record<string, string>

  /**
   * Extra sections shown on the title page when the user expands the
   * description, in order
   */
  extras?: MangaInfoExtra[]

  shareUrl?: string
}

/**
 * A section of other titles from the same extension, such as sequels or
 * recommendations. Tapping an item opens its title page.
 */
export interface MangaInfoRelationSection {
  type: 'relation'
  id: string
  title: string
  items: MangaInfoRelationItem[]
}

export interface MangaInfoRelationItem {
  /**
   * The mangaId of the related title
   */
  id: string
  imageUrl: string
  title: string
  /**
   * How the title is related, such as 'Sequel'
   */
  subtitle?: string
}

/**
 * A section of people, such as the staff or the characters and their voice
 * actors.
 *
 * Tapping an item opens search with the extension's advanced search form
 * filled in: the input row whose id matches this section's `id` is set to
 * the item's `id`, as if the user typed it there. When the form has no such
 * row, the item's `id` is searched as a title.
 */
export interface MangaInfoStaffSection {
  type: 'staff'
  id: string
  title: string
  items: MangaInfoStaffItem[]
}

export interface MangaInfoStaffItem {
  /**
   * The value the section's search filter is set to when tapped
   */
  id: string
  staff: MangaInfoPerson
  /**
   * The character the staff member plays, if any
   */
  character?: MangaInfoPerson
}

export interface MangaInfoPerson {
  imageUrl: string
  title: string
  /**
   * Such as a role ('Original Story') or a language ('Japanese')
   */
  subtitle?: string
}

export type MangaInfoExtra = MangaInfoRelationSection | MangaInfoStaffSection
