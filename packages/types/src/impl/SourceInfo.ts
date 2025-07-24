/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
export enum SourceIntents {
  NONE = 0,

  /**
   * @deprecated use {@link CHAPTER_PROVIDING}
   */
  MANGA_CHAPTERS = 1 << 0,
  CHAPTER_PROVIDING = 1 << 0,

  /**
   * @deprecated use {@link MANGA_PROGRESS_PROVIDING}
   */
  MANGA_PROGRESS = 1 << 1,
  MANGA_PROGRESS_PROVIDING = 1 << 1,

  /**
   * @deprecated use {@link DISCOVER_SECIONS_PROVIDING}
   */
  DISCOVER_SECIONS = 1 << 2,
  DISCOVER_SECIONS_PROVIDING = 1 << 2,

  /**
   * @deprecated use {@link MANAGED_COLLECTION_PROVIDING}
   */
  COLLECTION_MANAGEMENT = 1 << 3,
  MANAGED_COLLECTION_PROVIDING = 1 << 3,

  /**
   * @deprecated use {@link CLOUDFLARE_BYPASS_PROVIDING}
   */
  CLOUDFLARE_BYPASS_REQUIRED = 1 << 4,
  CLOUDFLARE_BYPASS_PROVIDING = 1 << 4,

  /**
   * @deprecated use {@link SETTINGS_FORM_PROVIDING}
   */
  SETTINGS_UI = 1 << 5,
  SETTINGS_FORM_PROVIDING = 1 << 5,

  /**
   * @deprecated use {@link SEARCH_RESULTS_PROVIDING}
   */
  MANGA_SEARCH = 1 << 6,
  SEARCH_RESULTS_PROVIDING = 1 << 6,
}

export interface SourceDeveloper {
  readonly name: string
  readonly website?: string
  readonly github?: string
}

export interface SourceBadge {
  readonly label: string
  readonly textColor: string
  readonly backgroundColor: string
}

/**
 * A content rating to be attributed to each source.
 */
export enum ContentRating {
  EVERYONE = 'SAFE',
  MATURE = 'MATURE',
  ADULT = 'ADULT',
}

/**
 * @deprecated use {@link ExtensionInfo}
 */
export type SourceInfo = ExtensionInfo

export interface ExtensionInfo {
  /**
   * Required class variable which denotes the current version of the application.
   * This is what the application uses to determine whether it needs to update it's local
   * version of the source, to a new version on the repository
   */
  readonly version: string

  /**
   * The title of this source, this is what will show up in the application
   * to identify what Manga location is being targeted
   */
  readonly name: string

  /**
   * An INTERNAL reference to an icon which is associated with this source.
   * This Icon should ideally be a matching aspect ratio (a cube)
   * The location of this should be in an includes directory next to your source.
   * For example, the Paperback link sits at: sources/Paperback/static/icon.png
   * This {@link Source.icon} field would then be simply referenced as 'icon.png' and
   * the path will then resolve correctly internally
   */
  readonly icon: string

  /**
   * A brief description of what this source targets. This is additional content displayed to the user when
   * browsing sources.
   * What website does it target? What features are working? Etc.
   */
  readonly description: string

  /**
   * A content rating attributed to each source. This can be one of three values, and should be set appropriately.
   * Everyone: This source does not have any sort of adult content available. Each title within is assumed safe for all audiences
   * Mature: This source MAY have mature content inside of it. Even if most content is safe, mature should be selected even if a small subset applies
   * Adult: This source probably has straight up pornography available.
   *
   * This rating helps us filter your source to users who have the necessary visibility rules toggled for their profile.
   * Naturally, only 'Everyone' sources will show up for users without an account, or without any mode toggles changed.
   */
  readonly contentRating: ContentRating

  /**
   * The author of this source. The string here will be shown off to the public on the application
   * interface, so only write what you're comfortable with showing
   */
  readonly developers: SourceDeveloper[]

  /**
   * An optional field that defines the language of the extension's source
   */
  readonly language?: string

  /**
   * Little bits of metadata which is rendered on the website
   * under your repositories section
   */
  readonly badges: SourceBadge[]

  readonly capabilities: SourceIntents[] | SourceIntents
}
