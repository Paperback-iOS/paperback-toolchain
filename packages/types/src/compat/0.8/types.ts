/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import {
  BasicRateLimiter,
  CookieStorageInterceptor,
  PaperbackInterceptor,
  type Request as PBRequest,
  type Response as PBResponse,
} from '../../index.js'

export interface DUIHeader extends DUIFormRow {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
}
declare global {
  namespace App {
    function createDUIHeader(info: DUIHeader): DUIHeader
  }
}
export interface DUIMultilineLabel extends DUIFormRow {
  id: string
  label: string
  value: string
}
declare global {
  namespace App {
    function createDUIMultilineLabel(info: DUIMultilineLabel): DUIMultilineLabel
  }
}
export interface DUIOAuthButton extends DUIFormRow {
  id: string
  label: string
  authorizeEndpoint: string
  clientId: string
  responseType:
    | {
        type: 'token'
      }
    | {
        type: 'code'
        tokenEndpoint: string
      }
    | {
        type: 'pkce'
        tokenEndpoint: string
        pkceCodeLength: number
        pkceCodeMethod: 'S256' | 'plain'
        formEncodeGrant: boolean
      }
  redirectUri?: string
  scopes?: string[]
  successHandler: (arg0: string, arg1: string | undefined) => Promise<void>
}
declare global {
  namespace App {
    function createDUIOAuthButton(info: DUIOAuthButton): DUIOAuthButton
  }
}
export interface DUILabel extends DUIFormRow {
  id: string
  label: string
  value?: string
}
declare global {
  namespace App {
    function createDUILabel(info: DUILabel): DUILabel
  }
}
export interface DUISwitch extends DUIFormRow {
  id: string
  label: string
  value: DUIBinding
}
declare global {
  namespace App {
    function createDUISwitch(info: DUISwitch): DUISwitch
  }
}
export interface DUIStepper extends DUIFormRow {
  id: string
  label: string
  value: DUIBinding
  min?: number
  max?: number
  step?: number
}
declare global {
  namespace App {
    function createDUIStepper(info: DUIStepper): DUIStepper
  }
}
export interface DUINavigationButton extends DUIFormRow {
  id: string
  label: string
  form: DUIForm
}
declare global {
  namespace App {
    function createDUINavigationButton(
      info: DUINavigationButton
    ): DUINavigationButton
  }
}
export interface DUISecureInputField extends DUIFormRow {
  id: string
  label: string
  value: DUIBinding
}
declare global {
  namespace App {
    function createDUISecureInputField(
      info: DUISecureInputField
    ): DUISecureInputField
  }
}
export interface DUIButton extends DUIFormRow {
  id: string
  label: string
  onTap: () => Promise<void>
}
declare global {
  namespace App {
    function createDUIButton(info: DUIButton): DUIButton
  }
}
export interface DUIInputField extends DUIFormRow {
  id: string
  label: string
  value: DUIBinding
}
declare global {
  namespace App {
    function createDUIInputField(info: DUIInputField): DUIInputField
  }
}
export interface DUILink extends DUIFormRow {
  id: string
  label: string
  value?: string
}
declare global {
  namespace App {
    function createDUILink(info: DUILink): DUILink
  }
}
export interface DUISelect extends DUIFormRow {
  id: string
  label: string
  options: string[]
  value: DUIBinding
  allowsMultiselect: boolean
  labelResolver: (arg0: string) => Promise<string>
}
declare global {
  namespace App {
    function createDUISelect(info: DUISelect): DUISelect
  }
}
export interface DUIForm {
  sections: () => Promise<DUISection[]>
  onSubmit?: (arg0: Record<any, any>) => Promise<void>
}
declare global {
  namespace App {
    function createDUIForm(info: DUIForm): DUIForm
  }
}
export interface DUIBinding {
  get: () => Promise<any>
  set?: (arg0: any | undefined) => Promise<void>
}
declare global {
  namespace App {
    function createDUIBinding(info: DUIBinding): DUIBinding
  }
}
export interface DUIFormRow {
  readonly id: string
}
export interface DUISection {
  id: string
  header?: string
  footer?: string
  isHidden: boolean
  rows: () => Promise<DUIFormRow[]>
}
declare global {
  namespace App {
    function createDUISection(info: DUISection): DUISection
  }
}
export interface Tag {
  readonly id: string
  readonly label: string
}
declare global {
  namespace App {
    function createTag(info: { id: string; label: string }): Tag
  }
}
export interface SourceStateManager {
  readonly keychain: SecureStateManager
  /*
   * internalName: _store
   */
  store(key: string, value: any): Promise<void>
  /*
   * internalName: _retrieve
   */
  retrieve(key: string): Promise<any>
}
declare global {
  namespace App {
    function createSourceStateManager(): SourceStateManager
  }
}
export interface TagSection {
  readonly id: string
  label: string
  tags: Tag[]
}
declare global {
  namespace App {
    function createTagSection(info: {
      id: string
      label: string
      tags: Tag[]
    }): TagSection
  }
}
export interface SecureStateManager {
  /*
   * internalName: _store
   */
  store(key: string, value: any): Promise<void>
  /*
   * internalName: _retrieve
   */
  retrieve(key: string): Promise<any>
}
export interface PBCanvas {
  readonly width: number
  readonly height: number
  /*
   * internalName: _data
   */
  readonly data?: RawData
  /*
   * internalName: setSize
   */
  setSize(width: number, height: number): void
  /*
   * internalName: drawImage
   */
  drawImage(
    pbImage: PBImage,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number
  ): void
  /*
   * internalName: _encode
   */
  encode(format: string): RawData | undefined
}
declare global {
  namespace App {
    function createPBCanvas(): PBCanvas
  }
}
export interface MangaProgress {
  sourceId: string
  mangaId: string
  lastReadChapterNumber: number
  /*
   * internalName: _lastReadVolumeNumber
   */
  lastReadVolumeNumber?: number
  trackedListName?: string
  lastReadTime?: Date
  /*
   * internalName: _userRating
   */
  userRating?: number
}
declare global {
  namespace App {
    function createMangaProgress(info: {
      mangaId: string
      lastReadChapterNumber: number
      lastReadVolumeNumber?: number
      trackedListName?: string
      lastReadTime?: Date
      userRating?: number
    }): MangaProgress
  }
}
export interface IconText {
  icon?: string
  text: string
}
export interface Cookie {
  name: string
  value: string
  domain: string
  path?: string
  created?: Date
  expires?: Date
}
declare global {
  namespace App {
    function createCookie(info: {
      name: string
      value: string
      domain: string
      path?: string
      created?: Date
      expires?: Date
    }): Cookie
  }
}
export interface TrackerActionQueue {
  /*
   * internalName: _queuedChapterReadActions
   */
  queuedChapterReadActions(): Promise<TrackedMangaChapterReadAction[]>
  /*
   * internalName: _retryChapterReadAction
   */
  retryChapterReadAction(
    chapterReadAction: TrackedMangaChapterReadAction
  ): Promise<void>
  /*
   * internalName: _discardChapterReadAction
   */
  discardChapterReadAction(
    chapterReadAction: TrackedMangaChapterReadAction
  ): Promise<void>
}
export interface SourceManga {
  /*
   * internalName: mangaId
   */
  id: string
  mangaInfo: MangaInfo
}
declare global {
  namespace App {
    function createSourceManga(info: {
      id: string
      mangaInfo: MangaInfo
    }): SourceManga
  }
}
export interface Response {
  readonly data?: string
  rawData?: RawData
  readonly status: number
  readonly headers: Record<any, any>
  readonly request: Request
}
export interface Request {
  url: string
  method: string
  headers: Record<string, string>
  data?: any
  param?: string
  cookies: Cookie[]
}
declare global {
  namespace App {
    function createRequest(info: {
      url: string
      method: string
      headers?: Record<string, string>
      param?: string
      data?: any
      cookies?: Cookie[]
    }): Request
  }
}
export interface PagedResults {
  results: PartialSourceManga[]
  metadata?: any
}
declare global {
  namespace App {
    function createPagedResults(info: {
      results?: PartialSourceManga[]
      metadata?: any
    }): PagedResults
  }
}
export interface SearchRequest {
  readonly title?: string
  readonly includedTags: Tag[]
  readonly excludedTags: Tag[]
  /*
   * internalName: _includeOperator
   */
  readonly includeOperator?: string
  /*
   * internalName: _excludeOperator
   */
  readonly excludeOperator?: string
  readonly parameters: Record<string, any>
}
export interface SourceInterceptor {
  /*
   * internalName: _interceptRequest
   */
  interceptRequest(request: Request): Promise<Request>
  /*
   * internalName: _interceptResponse
   */
  interceptResponse(response: Response): Promise<Response>
}
export interface TrackedMangaChapterReadAction {
  readonly mangaId: string
  readonly sourceMangaId: string
  readonly sourceChapterId: string
  readonly sourceId: string
  readonly chapterNumber: number
  readonly volumeNumber: number
  readonly readTime: Date
}
export interface RequestManager {
  readonly cookieStore?: SourceCookieStore
  /*
   * internalName: _interceptor
   */
  readonly interceptor?: SourceInterceptor
  readonly requestsPerSecond: number
  readonly requestTimeout: number
  getDefaultUserAgent(): Promise<string>
  /*
   * internalName: _schedule
   */
  schedule(request: Request, retry: number): Promise<Response>
}
declare global {
  namespace App {
    function createRequestManager(info: {
      interceptor?: SourceInterceptor
      requestsPerSecond?: number
      requestTimeout?: number
    }): RequestManager
  }
}
export interface SourceCookieStore {
  getAllCookies(): Cookie[]
  addCookie(cookies: Cookie): void
  removeCookie(cookie: Cookie): void
}
export interface PartialSourceManga {
  mangaId: string
  title: string
  image: string
  subtitle?: string
}
declare global {
  namespace App {
    function createPartialSourceManga(info: {
      mangaId: string
      image: string
      title: string
      subtitle?: string
    }): PartialSourceManga
  }
}
export interface MangaInfo {
  image: string
  artist: string
  author: string
  desc: string
  status: string
  hentai: boolean
  titles: string[]
  banner?: string
  /*
   * internalName: _rating
   */
  rating?: number
  tags: TagSection[]
  covers: string[]
  avgRating: number
  follows: number
  langFlag: string
  langName: string
  users: number
  views: number
}
declare global {
  namespace App {
    function createMangaInfo(info: {
      image: string
      artist?: string
      author?: string
      desc: string
      status: string
      hentai?: boolean
      titles: string[]
      banner?: string
      rating?: number
      tags?: TagSection[]
      covers?: string[]
      additionalInfo?: Record<string, string>
    }): MangaInfo
  }
}
export interface ChapterDetails {
  id: string
  mangaId: string
  pages: string[]
}
declare global {
  namespace App {
    function createChapterDetails(info: {
      id: string
      mangaId: string
      pages: string[]
    }): ChapterDetails
  }
}
export interface SearchField {
  readonly id: string
  readonly name: string
  readonly placeholder: string
}
declare global {
  namespace App {
    function createSearchField(info: {
      id: string
      name: string
      placeholder: string
    }): SearchField
  }
}
export interface PBImage {
  readonly width: number
  readonly height: number
  /*
   * internalName: _data
   */
  readonly data?: RawData
}
declare global {
  namespace App {
    function createPBImage(info: { data: RawData }): PBImage
  }
}
export interface MangaUpdates {
  ids: string[]
}
declare global {
  namespace App {
    function createMangaUpdates(info: { ids: string[] }): MangaUpdates
  }
}
export interface RawData {
  readonly length: number
  [index: number]: Byte
  toString(): string | undefined
}
declare global {
  namespace App {
    function createRawData(info: { byteArray: ByteArray }): RawData
  }
}
export interface HomeSection {
  readonly id: string
  readonly title: string
  items: PartialSourceManga[]
  containsMoreItems: boolean
}
declare global {
  namespace App {
    function createHomeSection(info: {
      id: string
      title: string
      type: string
      items?: PartialSourceManga[]
      containsMoreItems: boolean
    }): HomeSection
  }
}
export interface Chapter {
  id: string
  chapNum: number
  langCode: string
  name: string
  volume: number
  group: string
  time: Date
  sortingIndex: number
}
declare global {
  namespace App {
    function createChapter(info: {
      id: string
      chapNum: number
      volume?: number
      name?: string
      group?: string
      time?: Date
      langCode?: string
      sortingIndex?: number
    }): Chapter
  }
}
declare global {
  namespace App {
    function createSection(info: DUISection): DUISection
    function createButton(info: DUIButton): DUIButton
    function createHeader(info: DUIHeader): DUIHeader
    function createInputField(info: DUIInputField): DUIInputField
    function createLabel(info: DUILabel): DUILabel
    function createLink(info: DUILink): DUILink
    function createMultilineLabel(info: DUIMultilineLabel): DUIMultilineLabel
    function createNavigationButton(
      info: DUINavigationButton
    ): DUINavigationButton
    function createOAuthButton(info: DUIOAuthButton): DUIOAuthButton
    function createSecureInputField(
      info: DUISecureInputField
    ): DUISecureInputField
    function createSelect(info: DUISelect): DUISelect
    function createStepper(info: DUIStepper): DUIStepper
    function createSwitch(info: DUISwitch): DUISwitch
  }
}
/**
 * @deprecated Use {@link PaperbackExtensionBase}
 */
export abstract class Source
  implements Searchable, MangaProviding, ChapterProviding
{
  abstract readonly requestManager: RequestManager
  constructor(public cheerio: any) {}
  /**
   * Given a mangaID, this function should use a {@link RequestManager} object's {@link RequestManager.schedule} method
   * to grab and populate a {@link MangaInfo} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  abstract getMangaDetails(mangaId: string): Promise<SourceManga>
  /**
   * Given a mangaID, this function should use a {@link RequestManager} object's {@link RequestManager.schedule} method
   * to grab and populate a {@link Chapter} array.
   * @param mangaId The ID which this function is expected to grab data for
   */
  abstract getChapters(mangaId: string): Promise<Chapter[]>
  /**
   * Given a mangaID, this function should use a {@link RequestManager} object's {@link RequestManager.schedule} method
   * to grab and populate a {@link ChapterDetails} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  abstract getChapterDetails(
    mangaId: string,
    chapterId: string
  ): Promise<ChapterDetails>
  /**
   * Given a search request, this function should scan through the website's search page and
   * return relevent {@link MangaTile} objects to the given search parameters.
   * This function is ONLY expected to return the first page of search results.
   * If there is more than one page of search results, the {@link PagedResults.metadata}
   * variable should be filled out with some kind of information pointing to the next page of the search.
   * @param query A app-filled query which the search request should request from the website.
   * @param metadata A persistant metadata parameter which can be filled out with any data required between search page sections
   */
  abstract getSearchResults(
    query: SearchRequest,
    metadata: any
  ): Promise<PagedResults>
  /**
   * @deprecated use {@link Source.getSearchResults getSearchResults} instead
   */
  searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
    return this.getSearchResults(query, metadata)
  }
  // <-----------        OPTIONAL METHODS        -----------> //
  getSearchFields?(): Promise<SearchField[]>
  /**
   * (OPTIONAL METHOD) A function which communicates with a given source, and returns a list of all possible tags which the source supports.
   * These tags are generic and depend on the source. They could be genres such as 'Isekai, Action, Drama', or they can be
   * listings such as 'Completed, Ongoing'
   * These tags must be tags which can be used in the {@link searchRequest} function to augment the searching capability of the application
   */
  getSearchTags?(): Promise<TagSection[]>
  /**
   * @deprecated use {@link Source.getSearchTags} instead
   */
  async getTags(): Promise<TagSection[]> {
    return this.getSearchTags?.() ?? []
  }
  supportsTagExclusion?(): Promise<boolean>
  supportsSearchOperators?(): Promise<boolean>
  /**
   * A stateful source may require user input.
   * By supplying this value to the Source, the app will render your form to the user
   * in the application settings.
   */
  getSourceMenu?(): Promise<DUISection>
  /**
   * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
   * @param mangaId
   */
  getMangaShareUrl?(mangaId: string): string
  /**
   * @deprecated use {@link Source.getCloudflareBypassRequestAsync} instead
   */
  getCloudflareBypassRequest?(): Request
  /**
   * If a source is secured by Cloudflare, this method should be filled out.
   * By returning a request to the website, this source will attempt to create a session
   * so that the source can load correctly.
   * Usually the {@link Request} url can simply be the base URL to the source.
   */
  getCloudflareBypassRequestAsync?(): Promise<Request>
  /**
   * (OPTIONAL METHOD) A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
   * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
   * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
   * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
   * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
   * @param sectionCallback A callback which is run for each independant HomeSection.
   */
  getHomePageSections?(
    sectionCallback: (section: HomeSection) => void
  ): Promise<void>
  /**
   * (OPTIONAL METHOD) This function will take a given homepageSectionId and metadata value, and with this information, should return
   * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
   * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
   * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about
   * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
   * function. It initially starts out as null. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified,
   * the modified version will be supplied to this function instead of the origional {@link getHomePageSections}'s version.
   * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
   */
  getViewMoreItems?(
    homepageSectionId: string,
    metadata: any
  ): Promise<PagedResults>
}
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
export function convertTime(timeAgo: string): Date {
  let time: Date
  let trimmed: number = Number((/\d*/.exec(timeAgo) ?? [])[0])
  trimmed = trimmed == 0 && timeAgo.includes('a') ? 1 : trimmed
  if (timeAgo.includes('minutes')) {
    time = new Date(Date.now() - trimmed * 60000)
  } else if (timeAgo.includes('hours')) {
    time = new Date(Date.now() - trimmed * 3600000)
  } else if (timeAgo.includes('days')) {
    time = new Date(Date.now() - trimmed * 86400000)
  } else if (timeAgo.includes('year') || timeAgo.includes('years')) {
    time = new Date(Date.now() - trimmed * 31556952000)
  } else {
    time = new Date(Date.now())
  }
  return time
}
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
export function urlEncodeObject(obj: { [x: string]: any }): any {
  const ret: any = {}
  for (const entry of Object.entries(obj)) {
    ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1])
  }
  return ret
}
export enum HomeSectionType {
  singleRowNormal = 'singleRowNormal',
  singleRowLarge = 'singleRowLarge',
  doubleRow = 'doubleRow',
  featured = 'featured',
}
export enum SourceIntents {
  MANGA_CHAPTERS = 1 << 0,
  MANGA_TRACKING = 1 << 1,
  HOMEPAGE_SECTIONS = 1 << 2,
  COLLECTION_MANAGEMENT = 1 << 3,
  CLOUDFLARE_BYPASS_REQUIRED = 1 << 4,
  SETTINGS_UI = 1 << 5,
}
export interface SourceInfo {
  // Returns the version of the source
  // Ensures that the app is using the most up to date version
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
   * For example, the MangaPark link sits at: sources/MangaPark/includes/icon.png
   * This {@link Source.icon} field would then be simply referenced as 'icon.png' and
   * the path will then resolve correctly internally
   */
  readonly icon: string
  /**
   * The author of this source. The string here will be shown off to the public on the application
   * interface, so only write what you're comfortable with showing
   */
  readonly author: string
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
   * A required field which points to the source's front-page.
   * Eg. https://mangadex.org
   * This must be a fully qualified URL
   */
  readonly websiteBaseURL: string
  /**
   * An optional field where the author may put a link to their website
   */
  readonly authorWebsite?: string
  /**
   * An optional field that defines the language of the extension's source
   */
  readonly language?: string
  /**
   * An optional field of source tags: Little bits of metadata which is rendered on the website
   * under your repositories section
   */
  readonly sourceTags?: Badge[]
  readonly intents?: SourceIntents
}
/**
 * A content rating to be attributed to each source.
 */
export enum ContentRating {
  EVERYONE = 'EVERYONE',
  MATURE = 'MATURE',
  ADULT = 'ADULT',
}
export interface Badge {
  readonly text: string
  readonly type: BadgeColor
}
export enum BadgeColor {
  BLUE = 'default',
  GREEN = 'success',
  GREY = 'info',
  YELLOW = 'warning',
  RED = 'danger',
}
export type PaperbackExtensionBase = Requestable & MangaProviding & Searchable
declare global {
  type Byte =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59
    | 60
    | 61
    | 62
    | 63
    | 64
    | 65
    | 66
    | 67
    | 68
    | 69
    | 70
    | 71
    | 72
    | 73
    | 74
    | 75
    | 76
    | 77
    | 78
    | 79
    | 80
    | 81
    | 82
    | 83
    | 84
    | 85
    | 86
    | 87
    | 88
    | 89
    | 90
    | 91
    | 92
    | 93
    | 94
    | 95
    | 96
    | 97
    | 98
    | 99
    | 100
    | 101
    | 102
    | 103
    | 104
    | 105
    | 106
    | 107
    | 108
    | 109
    | 110
    | 111
    | 112
    | 113
    | 114
    | 115
    | 116
    | 117
    | 118
    | 119
    | 120
    | 121
    | 122
    | 123
    | 124
    | 125
    | 126
    | 127
    | 128
    | 129
    | 130
    | 131
    | 132
    | 133
    | 134
    | 135
    | 136
    | 137
    | 138
    | 139
    | 140
    | 141
    | 142
    | 143
    | 144
    | 145
    | 146
    | 147
    | 148
    | 149
    | 150
    | 151
    | 152
    | 153
    | 154
    | 155
    | 156
    | 157
    | 158
    | 159
    | 160
    | 161
    | 162
    | 163
    | 164
    | 165
    | 166
    | 167
    | 168
    | 169
    | 170
    | 171
    | 172
    | 173
    | 174
    | 175
    | 176
    | 177
    | 178
    | 179
    | 180
    | 181
    | 182
    | 183
    | 184
    | 185
    | 186
    | 187
    | 188
    | 189
    | 190
    | 191
    | 192
    | 193
    | 194
    | 195
    | 196
    | 197
    | 198
    | 199
    | 200
    | 201
    | 202
    | 203
    | 204
    | 205
    | 206
    | 207
    | 208
    | 209
    | 210
    | 211
    | 212
    | 213
    | 214
    | 215
    | 216
    | 217
    | 218
    | 219
    | 220
    | 221
    | 222
    | 223
    | 224
    | 225
    | 226
    | 227
    | 228
    | 229
    | 230
    | 231
    | 232
    | 233
    | 234
    | 235
    | 236
    | 237
    | 238
    | 239
    | 240
    | 241
    | 242
    | 243
    | 244
    | 245
    | 246
    | 247
    | 248
    | 249
    | 250
    | 251
    | 252
    | 253
    | 254
  type ByteArray = Uint8Array
  namespace App {
    function createByteArray(info: RawData): ByteArray
  }
}
/**
 * @deprecated use {@link RequestManagerProviding}
 */
export type Requestable = RequestManagerProviding
export interface RequestManagerProviding {
  readonly requestManager: RequestManager
}
export interface ChapterProviding extends MangaProviding {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link Chapter} array.
   * @param mangaId The ID which this function is expected to grab data for
   */
  getChapters(mangaId: string): Promise<Chapter[]>
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link ChapterDetails} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails>
}
export interface MangaProviding extends RequestManagerProviding {
  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link MangaInfo} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  getMangaDetails(mangaId: string): Promise<SourceManga>
  /**
   * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
   * @param mangaId
   */
  getMangaShareUrl?(mangaId: string): string
}
export interface HomePageSectionsProviding {
  /**
   * A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
   * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
   * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
   * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
   * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
   * @param sectionCallback A callback which is run for each independant HomeSection.
   */
  getHomePageSections(
    sectionCallback: (section: HomeSection) => void
  ): Promise<void>
  /**
   * This function will take a given homepageSectionId and metadata value, and with this information, should return
   * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
   * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
   * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about
   * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
   * function. It initially starts out as null. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified,
   * the modified version will be supplied to this function instead of the origional {@link getHomePageSections}'s version.
   * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
   */
  getViewMoreItems(
    homepageSectionId: string,
    metadata: any
  ): Promise<PagedResults>
}
export interface MangaProgressProviding {
  getMangaProgressManagementForm(mangaId: string): Promise<DUIForm>
  getMangaProgress(mangaId: string): Promise<MangaProgress | undefined>
  processChapterReadActionQueue(actionQueue: TrackerActionQueue): Promise<void>
}
export interface CloudflareBypassRequestProviding
  extends RequestManagerProviding {
  /**
   * If a source is secured by Cloudflare, this method should be filled out.
   * By returning a request to the website, this source will attempt to create a session
   * so that the source can load correctly.
   * Usually the {@link Request} url can simply be the base URL to the source.
   */
  getCloudflareBypassRequestAsync(): Promise<Request>
}
/**
 * @deprecated Use {@link SearchResultsProviding}
 */
export type Searchable = SearchResultsProviding
export interface SearchResultsProviding extends MangaProviding {
  getSearchResults(
    query: SearchRequest,
    metadata: unknown | undefined
  ): Promise<PagedResults>
  getSearchTags?(): Promise<TagSection[]>
  getSearchFields?(): Promise<SearchField[]>
  supportsTagExclusion?(): Promise<boolean>
  supportsSearchOperators?(): Promise<boolean>
}

const AppCompat = {} as typeof App
AppCompat.createSourceStateManager = function (): SourceStateManager {
  return {
    keychain: {
      async store(key, value) {
        Application.setSecureState(value, key)
      },
      async retrieve(key) {
        return Application.getSecureState(key)
      },
    },
    async store(key, value) {
      Application.setState(value, key)
    },
    async retrieve(key) {
      return Application.getState(key)
    },
  }
}

export function convert08RequestTo09Request(request: Request): PBRequest {
  let url = request.url
  if (request.param) {
    url += request.param
  }

  const cookies: Record<string, string> = {}
  for (const cookie of request.cookies ?? []) {
    cookies[cookie.name] = cookie.value
  }

  return {
    url,
    method: request.method,
    body: request.data,
    headers: request.headers,
    cookies,
  }
}

export function convert09RequestTo08Request(request: PBRequest): Request {
  return {
    url: request.url,
    method: request.method,
    headers: request.headers ?? {},
    cookies: Object.keys(request.cookies ?? {}).map((x) => ({
      name: x,
      value: request.cookies![x]!,
      domain: '',
    })),
    data: request.body,
  }
}

AppCompat.createRequestManager = function (info): RequestManager {
  const interceptor = new (class extends PaperbackInterceptor {
    constructor(private legacyInterceptor: SourceInterceptor | undefined) {
      super('main')
    }

    override async interceptRequest(request: PBRequest): Promise<PBRequest> {
      if (!this.legacyInterceptor) return request

      const oldRequest = convert09RequestTo08Request(request)

      const interceptedRequest =
        await this.legacyInterceptor.interceptRequest(oldRequest)

      return convert08RequestTo09Request(interceptedRequest)
    }

    override async interceptResponse(
      request: PBRequest,
      response: PBResponse,
      data: ArrayBuffer
    ): Promise<ArrayBuffer> {
      if (!this.legacyInterceptor) return data
      return data
    }
  })(info.interceptor)

  const rateLimiter = new BasicRateLimiter('rateLimit', {
    numberOfRequests: info.requestsPerSecond ?? 2,
    bufferInterval: 1,
    ignoreImages: true,
  })

  const cookieStore = new CookieStorageInterceptor({ storage: 'memory' })

  interceptor.registerInterceptor()
  rateLimiter.registerInterceptor()
  cookieStore.registerInterceptor()

  return {
    __backing_interceptor: interceptor,
    __backing_rateLimit: rateLimiter,
    __backing_cookieStore: cookieStore,
    interceptor: info.interceptor,
    cookieStore: {
      // @ts-expect-error
      getAllCookies() {
        return cookieStore.cookies
      },
      addCookie(cookies) {
        cookieStore.setCookie(cookies)
      },
      removeCookie(cookie) {
        cookieStore.deleteCookie(cookie)
      },
    },
    async getDefaultUserAgent() {
      return Application.getDefaultUserAgent()
    },
    requestsPerSecond: info.requestsPerSecond ?? 2,
    requestTimeout: info.requestTimeout ?? 30_000,
    async schedule(request) {
      const finalRequest = convert08RequestTo09Request(request)

      console.log('[COMPAT] SCHEDULING REQUEST TO ' + finalRequest.url)
      const [response, data] = await Application.scheduleRequest(finalRequest)

      return {
        request,
        headers: response.headers,
        status: response.status,
        data: Application.arrayBufferToUTF8String(data),
        get rawData() {
          return new Uint8Array(data) as RawData
        },
      }
    },
  }
}

globalThis.App = new Proxy(AppCompat, {
  get(target, p) {
    if ((target as any)[p]) {
      return (target as any)[p]
    }

    if (typeof p === 'string' && p.startsWith('create')) {
      if (p.startsWith('createDUI')) {
        const type = p.slice(6)
        return (anyProps: any) => {
          return Object.defineProperty(anyProps, 'type', {
            enumerable: true,
            value: type,
          })
        }
      }

      return (anyProps: any) => anyProps
    }

    return undefined
  },
})
