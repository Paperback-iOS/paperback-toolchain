/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonRow,
  type Chapter,
  type ChapterDetails,
  type ChapterProviding,
  type CloudflareBypassRequestProviding,
  CloudflareError,
  ContentRating,
  type Cookie,
  type DiscoverSection,
  type DiscoverSectionItem,
  type DiscoverSectionProviding,
  DiscoverSectionType,
  EndOfPageResults,
  type Extension,
  Form,
  type FormItemElement,
  type FormSectionElement,
  InputRow,
  LabelRow,
  type LabelRowProps,
  type MangaProviding,
  NavigationRow,
  OAuthButtonRow,
  type OAuthButtonRowProps,
  type PagedResults,
  PaperbackInterceptor,
  type Request,
  type Response,
  type SearchFilter,
  type SearchQuery,
  type SearchResultItem,
  type SearchResultsProviding,
  Section,
  type SelectorID,
  type SettingsFormProviding,
  type SourceManga,
  ToggleRow,
} from '../../index.js'

import {
  type ChapterProviding as LegacyChapterProviding,
  type DUIButton,
  type DUIForm,
  type DUIHeader,
  type DUIInputField,
  type DUILabel,
  type DUIMultilineLabel,
  type DUINavigationButton,
  type DUIOAuthButton,
  type DUISection,
  type DUISecureInputField,
  type DUISwitch,
  type HomePageSectionsProviding as LegacyHomePageSectionsProviding,
  type PaperbackExtensionBase,
  type SearchRequest as LegacySearchRequest,
  type SearchResultsProviding as LegacySearchResultsProviding,
  type Source as LegacySource,
  type CloudflareBypassRequestProviding as LegacyCloudflareBypassRequestProviding,
  convert08RequestTo09Request,
} from './types.js'

class CloudflareInterceptor extends PaperbackInterceptor {
  readonly ERROR_CODES = [403, 503]
  readonly SERVER_CHECK = ['cloudflare-nginx', 'cloudflare']
  readonly COOKIE_NAMES = ['cf_clearance']

  cloudflareRequestProvider: LegacyCloudflareBypassRequestProviding

  constructor(
    cloudflareRequestProvider: LegacyCloudflareBypassRequestProviding
  ) {
    super('cloudflareInterceptor')
    this.cloudflareRequestProvider = cloudflareRequestProvider
  }

  override async interceptRequest(request: Request): Promise<Request> {
    return request
  }

  override async interceptResponse(
    request: Request,
    response: Response,
    data: ArrayBuffer
  ): Promise<ArrayBuffer> {
    // check cloudflare
    const isCloudflare = this.SERVER_CHECK.includes(
      response.headers['Server'] ?? ''
    )

    const isError = this.ERROR_CODES.includes(response.status)

    if (isCloudflare && isError) {
      const cloudflareRequest = await this.cloudflareRequestProvider //
        .getCloudflareBypassRequestAsync()

      const finalCloudflareRequest =
        convert08RequestTo09Request(cloudflareRequest)

      throw new CloudflareError(finalCloudflareRequest)
    }

    // This is kinda expensive, we can probably just leave it
    // const containsChallenge =
    //   bodyText.includes('challenge-error-title') ||
    //   bodyText.includes('challenge-error-text')

    return data
  }
}

type Source = LegacySource &
  PaperbackExtensionBase &
  LegacyChapterProviding &
  LegacyHomePageSectionsProviding &
  LegacySearchResultsProviding

class _CompatWrapper
  implements
    Extension,
    MangaProviding,
    SearchResultsProviding,
    ChapterProviding,
    DiscoverSectionProviding,
    SettingsFormProviding,
    CloudflareBypassRequestProviding
{
  private cloudflareInterceptor?: CloudflareInterceptor
  private homepageItemCache: Record<string, DiscoverSectionItem[]> = {}
  constructor(private legacySource: Source) {}

  async initialise() {
    if ('getCloudflareBypassRequestAsync' in this.legacySource) {
      this.cloudflareInterceptor = new CloudflareInterceptor(
        this.legacySource as LegacyCloudflareBypassRequestProviding
      )

      this.cloudflareInterceptor.registerInterceptor()
    }
  }

  async getDiscoverSections(): Promise<DiscoverSection[]> {
    const discoverSections: DiscoverSection[] = []

    await this.legacySource.getHomePageSections?.((section) => {
      discoverSections.push({
        id: section.id,
        title: section.title,
        type: DiscoverSectionType.simpleCarousel,
      })

      if (
        !section.containsMoreItems &&
        section.items &&
        section.items.length > 0
      ) {
        this.homepageItemCache[section.id] = section.items.map((x) => {
          return {
            type: 'simpleCarouselItem',
            title: x.title,
            subtitle: x.subtitle,
            mangaId: x.mangaId,
            imageUrl: x.image,
          } as DiscoverSectionItem
        })
      }
    })

    return discoverSections
  }

  async getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: unknown | undefined
  ): Promise<PagedResults<DiscoverSectionItem>> {
    const cachedItems = this.homepageItemCache[section.id]
    if (cachedItems) {
      return { items: cachedItems }
    }

    const result = await this.legacySource.getViewMoreItems?.(
      section.id,
      metadata
    )

    if (result) {
      return {
        items: result.results.map((x) => {
          return {
            type: 'simpleCarouselItem',
            title: x.title,
            subtitle: x.subtitle,
            mangaId: x.mangaId,
            imageUrl: x.image,
          } as DiscoverSectionItem
        }),
        metadata: result.metadata,
      }
    } else {
      return EndOfPageResults
    }
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const legacyManga = await this.legacySource.getMangaDetails(mangaId)

    return {
      mangaId: legacyManga.id,
      mangaInfo: {
        contentRating: ContentRating.EVERYONE,
        primaryTitle: legacyManga.mangaInfo.titles.shift()!,
        secondaryTitles: legacyManga.mangaInfo.titles,
        synopsis: legacyManga.mangaInfo.desc,
        thumbnailUrl: legacyManga.mangaInfo.image,
        status: legacyManga.mangaInfo.status,
      },
    }
  }

  async getSearchFilters(): Promise<SearchFilter[]> {
    const searchFilters: SearchFilter[] = []
    const legacyFilters = this.legacySource.getSearchTags
      ? await this.legacySource.getSearchTags()
      : []

    for (const filter of legacyFilters) {
      searchFilters.push({
        id: filter.id,
        title: filter.label,
        type: 'multiselect',
        options: filter.tags.map((x) => {
          return { id: x.id, value: x.label }
        }),
        value: {},
        allowExclusion: true,
        allowEmptySelection: true,
        maximum: undefined,
      })
    }

    return searchFilters
  }

  async getSearchResults(
    query: SearchQuery,
    metadata: unknown | undefined
  ): Promise<PagedResults<SearchResultItem>> {
    const legacyQuery: LegacySearchRequest = {
      title: query.title,
      includedTags: [],
      excludedTags: [],
      parameters: {},
    }

    for (const filter of query.filters) {
      if (typeof filter.value === 'string') {
        legacyQuery.parameters[filter.id] = filter.value
      } else {
        for (const tag of Object.keys(filter.value)) {
          if (filter.value[tag] === 'included') {
            legacyQuery.includedTags.push({ id: tag, label: tag })
          } else {
            legacyQuery.excludedTags.push({ id: tag, label: tag })
          }
        }
      }
    }

    const legacyResults = await this.legacySource.getSearchResults(
      legacyQuery,
      metadata
    )

    return {
      items: legacyResults.results.map((x) => {
        return {
          imageUrl: x.image,
          title: x.title,
          mangaId: x.mangaId,
          subtitle: x.subtitle,
        } as SearchResultItem
      }),
      metadata: legacyResults.metadata,
    }
  }

  async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
    const legacyChapters = await this.legacySource.getChapters(
      sourceManga.mangaId
    )

    return legacyChapters.map((x) => {
      return {
        chapNum: x.chapNum,
        volume: x.volume,
        sourceManga: sourceManga,
        publishDate: x.time,
        chapterId: x.id,
        langCode: x.langCode,
        title: x.name,
        version: x.group,
        sortingIndex: x.sortingIndex,
      }
    })
  }

  async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
    return await this.legacySource.getChapterDetails(
      chapter.sourceManga.mangaId,
      chapter.chapterId
    )
  }

  async getSettingsForm(): Promise<Form> {
    if (this.legacySource.getSourceMenu) {
      const rootSection = await this.legacySource.getSourceMenu()
      return new _CompatForm({
        async sections() {
          return [rootSection]
        },
      })
    } else {
      throw new Error('Not Supported')
    }
  }

  async saveCloudflareBypassCookies(cookies: Cookie[]): Promise<void> {
    for (const cookie of cookies) {
      this.legacySource.requestManager.cookieStore?.addCookie(cookie)
    }
  }
}

class _CompatSection implements FormSectionElement {
  id: string
  header?: string
  footer?: string

  bindingValueCache: Record<string, any> = {}
  items: FormItemElement<unknown>[] = []
  proxies: Record<string, any> = {}

  constructor(
    private form: _CompatForm,
    private section: DUISection
  ) {
    this.id = section.id
    if (section.header) this.header = section.header
    if (section.footer) this.footer = section.footer

    this.reloadRows()
  }

  reloadRows() {
    const newItems: FormItemElement<unknown>[] = []
    this.items = newItems
    console.log('reloadForm CALLED FROM reloadRows')
    this.form.reloadForm()

    this.section
      .rows()
      .then((rows) => {
        if (this.items !== newItems) return
        newItems.push(
          ...rows.map((row: any) => {
            const rowId = (row['id'] as string) ?? 'unknown'

            switch (row['type']) {
              case 'DUIHeader': {
                const header = row as DUIHeader
                return LabelRow(rowId, {
                  title: header.title,
                  subtitle: header.subtitle,
                } as LabelRowProps)
              }

              case 'DUILabel':
              case 'DUIMultilineLabel': {
                const label = row as DUILabel | DUIMultilineLabel
                return LabelRow(rowId, {
                  title: label.label,
                  subtitle: label.value,
                } as LabelRowProps)
              }

              case 'DUIOAuthButton': {
                const button = row as DUIOAuthButton
                return OAuthButtonRow(rowId, {
                  title: button.label,
                  authorizeEndpoint: button.authorizeEndpoint,
                  clientId: button.clientId,
                  responseType: button.responseType,
                  redirectUri: button.redirectUri,
                  scopes: button.scopes,
                  onSuccess: this.proxifiedClosureSelector(
                    rowId,
                    button,
                    'successHandler'
                  ),
                } as OAuthButtonRowProps)
              }

              case 'DUIButton': {
                const button = row as DUIButton
                return ButtonRow(rowId, {
                  title: button.label,
                  onSelect: this.proxifiedClosureSelector(
                    rowId,
                    button,
                    'onTap'
                  ),
                })
              }

              case 'DUISecureInputField':
              case 'DUIInputField': {
                const input = row as DUIInputField | DUISecureInputField
                input.value
                  .get()
                  .then((value) => {
                    if (this.bindingValueCache[rowId] !== value) {
                      console.log(
                        `NEW VALUE BY ${rowId}, ${this.bindingValueCache[rowId]}, ${value}`
                      )
                      this.bindingValueCache[rowId] = value
                      this.reloadRows()
                    }
                  })
                  .catch((e) => {
                    console.log('ERROR:' + e)
                  })

                return InputRow(rowId, {
                  title: input.label,
                  value: this.bindingValueCache[rowId] ?? '',
                  onValueChange: this.proxifiedClosureSelector(
                    rowId,
                    input.value,
                    'set'
                  ),
                })
              }

              case 'DUINavigationButton': {
                const button = row as DUINavigationButton
                return NavigationRow(rowId, {
                  title: button.label,
                  form: new _CompatForm(button.form),
                })
              }

              case 'DUISwitch': {
                const toggle = row as DUISwitch
                toggle.value
                  .get()
                  .then((value) => {
                    console.log('NEW VALUE: ' + value)
                    if (this.bindingValueCache[rowId] !== value) {
                      console.log(
                        `NEW VALUE BY ${rowId}, ${this.bindingValueCache[rowId]}, ${value}`
                      )
                      this.bindingValueCache[rowId] = value
                      this.reloadRows()
                    }
                  })
                  .catch((e) => {
                    console.log('ERROR:' + e)
                  })

                return ToggleRow(rowId, {
                  title: toggle.label,
                  value: this.bindingValueCache[rowId] ?? false,
                  onValueChange: this.proxifiedClosureSelector(
                    rowId,
                    toggle.value,
                    'set'
                  ),
                })
              }

              default: {
                return LabelRow(rowId, {
                  title: 'Unsupported 0.8 Row',
                  subtitle: `ID: ${rowId};\nType: ${row['type']}`,
                })
              }
            }
          })
        )
        this.form.reloadForm()
      })
      .catch((e) => {
        console.log('ERROR:' + e)
      })
  }

  proxifiedClosureSelector<T>(
    id: string,
    obj: any,
    method: string
  ): SelectorID<T> {
    const key = '__proxied_' + method
    this.proxies[id] = Object.defineProperty(obj, key, {
      enumerable: true,
      value: function () {
        // eslint-disable-next-line prefer-rest-params
        const ret = obj[method](...arguments)

        // eslint-disable-next-line prefer-rest-params
        console.log(`CALLING ${method} WITH ${JSON.stringify(arguments)}`)

        if (ret.then) {
          ret.then(() => this.reloadRows())
        } else {
          this.reloadRows()
        }

        return ret
      },
    })

    return Application.Selector(this.proxies[id], key)
  }
}

class _CompatForm extends Form {
  private sections: FormSectionElement[] = []

  constructor(private form: DUIForm) {
    super()
  }

  override getSections(): FormSectionElement[] {
    if (this.sections.length == 0) {
      return [
        Section('loading', [
          LabelRow('loading', {
            title: 'Loading Sections...',
          }),
        ]),
      ]
    }

    return this.sections
  }

  reloadSections() {
    const newSections: FormSectionElement[] = []
    this.sections = newSections
    console.log('reloadForm CALLED FROM reloadSections')
    this.reloadForm()

    this.form.sections().then((sections) => {
      if (this.sections !== newSections) return
      this.sections.push(
        ...sections.map((section) => {
          return new _CompatSection(this, section)
        })
      )

      this.reloadForm()
    })
  }

  override formWillAppear(): void {
    this.reloadSections()
  }
}

type CompatWrapperInfo = {
  registerHomeSectionsInInitialise: boolean
}

export function CompatWrapper(
  info: CompatWrapperInfo,
  legacySource: Source,
  newSource: Extension | undefined = undefined
): Extension {
  const wrapper = new _CompatWrapper(legacySource)

  // @ts-expect-error proxy shenanigans
  return new Proxy(newSource ?? {}, {
    has(target, p) {
      console.log(`[COMPAT] has CALLED WITH '${p.toString()}'`)
      // @ts-expect-error proxy shenanigans
      return target[p] !== undefined || wrapper[p] !== undefined
    },
    get(target, p) {
      console.log(`[COMPAT] get CALLED WITH '${p.toString()}'`)

      if (typeof p === 'string' && p === 'initialise') {
        return async () => {
          await wrapper.initialise()
          // @ts-expect-error proxy shenanigans
          await target[p]?.()
        }
      }

      // @ts-expect-error proxy shenanigans
      if (target[p]) {
        // @ts-expect-error proxy shenanigans
        return target[p]
      } // @ts-expect-error proxy shenanigans
      else if (wrapper[p]) {
        // @ts-expect-error proxy shenanigans
        return wrapper[p]
      }

      return undefined
    },
  })
}
