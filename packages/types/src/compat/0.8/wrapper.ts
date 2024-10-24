import { Chapter, ChapterDetails, ChapterProviding, ContentRating, DiscoverSection, DiscoverSectionItem, DiscoverSectionType, EndOfPageResults, Extension, MangaProviding, PagedResults, SearchQuery, SearchResultItem, SearchResultsProviding, SourceManga, DiscoverSectionProviding } from "@paperback/types";
import {
    PaperbackExtensionBase,
    SearchRequest as LegacySearchRequest,
    SearchResultsProviding as LegacySearchResultsProviding,
    HomePageSectionsProviding as LegacyHomePageSectionsProviding,
    ChapterProviding as LegacyChapterProviding
} from "./types";

type Source = PaperbackExtensionBase & LegacyChapterProviding & LegacyHomePageSectionsProviding & LegacySearchResultsProviding

class _CompatWrapper implements Extension, MangaProviding, SearchResultsProviding, ChapterProviding, DiscoverSectionProviding {
    private homepageItemCache: Record<string, DiscoverSectionItem[]> = {}
    constructor(private legacySource: Source) { }

    async initialise() {}

    async getDiscoverSections(): Promise<DiscoverSection[]> {
        const discoverSections: DiscoverSection[] = []

        await this.legacySource.getHomePageSections?.((section) => {
            discoverSections.push({
                id: section.id,
                title: section.title,
                type: DiscoverSectionType.simpleCarousel
            })

            if (!section.containsMoreItems && section.items.length > 0) {
                this.homepageItemCache[section.id] = section.items.map(x => {
                    return {
                        type: 'simpleCarouselItem',
                        title: x.title,
                        subtitle: x.subtitle,
                        mangaId: x.mangaId,
                        imageUrl: x.image
                    }
                })
            }
        })

        return discoverSections
    }

    async getDiscoverSectionItems(section: DiscoverSection, metadata: unknown | undefined): Promise<PagedResults<DiscoverSectionItem>> {
        const cachedItems = this.homepageItemCache[section.id]
        if (cachedItems) {
            return { items: cachedItems }
        }

        const result = await this.legacySource.getViewMoreItems?.(section.id, metadata)

        if (result) {
            return {
                items: result.results.map(x => {
                    return {
                        type: 'simpleCarouselItem',
                        title: x.title,
                        subtitle: x.subtitle,
                        mangaId: x.mangaId,
                        imageUrl: x.image
                    }
                }),
                metadata: result.metadata
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
                status: legacyManga.mangaInfo.status
            }
        }
    }

    async getSearchResults(query: SearchQuery, metadata: unknown | undefined): Promise<PagedResults<SearchResultItem>> {
        const legacyQuery: LegacySearchRequest = {
            title: query.title,
            includedTags: [],
            excludedTags: [],
            parameters: {}
        }

        for (const filter of query.filters) {
            if (typeof filter.value === 'string') {
                legacyQuery.parameters[filter.id] = filter.value
            } else {
                for (const tag of Object.keys(filter.value)) {
                    if (filter.value[tag] === 'included'){
                        legacyQuery.includedTags.push({id: tag, label: tag})
                    } else {
                        legacyQuery.excludedTags.push({id: tag, label: tag})
                    }
                }
            }
        }

        let legacyResults = await this.legacySource.getSearchResults(legacyQuery, metadata)

        return {
            items: legacyResults.results.map(x => {
                return {
                    imageUrl: x.image,
                    title: x.title,
                    mangaId: x.mangaId,
                    subtitle: x.subtitle
                }
            }),
            metadata: legacyResults.metadata
        }
    }

    async getChapters(sourceManga: SourceManga, sinceDate?: Date): Promise<Chapter[]> {
        const legacyChapters = await this.legacySource.getChapters(sourceManga.mangaId)

        return legacyChapters.map(x => {
            return {
                chapNum: x.chapNum,
                volume: x.volume,
                sourceManga: sourceManga,
                publishDate: x.time,
                chapterId: x.id,
                langCode: x.langCode,
                title: x.name,
                version: x.group,
                sortingIndex: x.sortingIndex
            }
        })
    }

    async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
        return await this.legacySource.getChapterDetails(chapter.sourceManga.mangaId, chapter.chapterId)
    }
}

type CompatWrapperInfo = {
    registerHomeSectionsInInitialise: boolean
}

export function CompatWrapper(
    info: CompatWrapperInfo,
    legacySource: Source,
    newSource: Extension | undefined = undefined,
): Extension {
    let wrapper = new _CompatWrapper(legacySource)

    // @ts-ignore
    return new Proxy(newSource ?? {}, {
        has(target, p) {
            // @ts-ignore
            return target[p] !== undefined || wrapper[p] !== undefined
        },
        get(target, p, receiver) {
            console.log(`[COMPAT] get CALLED WITH '${p.toString()}'`)

            if (typeof p === 'string' && p === 'initialise') {
                return async () => {
                    if (info.registerHomeSectionsInInitialise) {
                        await wrapper.initialise()
                    }

                    // @ts-ignore
                    await target[p]?.()
                }
            }

            // @ts-ignore
            if (target[p]) {
                // @ts-ignore
                return target[p]
            }
            // @ts-ignore
            else if (wrapper[p]) {
                // @ts-ignore
                return wrapper[p]
            }

            return undefined
        },
    })
}