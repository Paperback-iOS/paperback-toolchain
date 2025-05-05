// deno-lint-ignore-file ban-ts-comment no-unused-vars
import {
  ButtonRow,
  Chapter,
  ChapterDetails,
  ChapterProviding,
  ContentRating,
  DiscoverSection,
  DiscoverSectionItem,
  DiscoverSectionProviding,
  DiscoverSectionType,
  EndOfPageResults,
  Extension,
  Form,
  FormItemElement,
  FormSectionElement,
  InputRow,
  LabelRow,
  MangaProviding,
  NavigationRow,
  OAuthButtonRow,
  PagedResults,
  SearchFilter,
  SearchQuery,
  SearchResultItem,
  SearchResultsProviding,
  Section,
  SettingsFormProviding,
  SourceManga,
  ToggleRow,
} from "../../index";

import {
  ChapterProviding as LegacyChapterProviding,
  DUIButton,
  DUIForm,
  DUIFormRow,
  DUIHeader,
  DUIInputField,
  DUILabel,
  DUIMultilineLabel,
  DUINavigationButton,
  DUIOAuthButton,
  DUISection,
  DUISecureInputField,
  DUISwitch,
  HomePageSectionsProviding as LegacyHomePageSectionsProviding,
  PaperbackExtensionBase,
  SearchRequest as LegacySearchRequest,
  SearchResultsProviding as LegacySearchResultsProviding,
  Source as LegacySource,
} from "./types";

type Source =
  & LegacySource
  & PaperbackExtensionBase
  & LegacyChapterProviding
  & LegacyHomePageSectionsProviding
  & LegacySearchResultsProviding;

class _CompatWrapper
  implements
    Extension,
    MangaProviding,
    SearchResultsProviding,
    ChapterProviding,
    DiscoverSectionProviding,
    SettingsFormProviding {
  private homepageItemCache: Record<string, DiscoverSectionItem[]> = {};
  constructor(private legacySource: Source) {}

  async initialise() {}

  async getDiscoverSections(): Promise<DiscoverSection[]> {
    const discoverSections: DiscoverSection[] = [];

    await this.legacySource.getHomePageSections?.((section) => {
      discoverSections.push({
        id: section.id,
        title: section.title,
        type: DiscoverSectionType.simpleCarousel,
      });

      if (!section.containsMoreItems && section.items && section.items.length > 0) {
        this.homepageItemCache[section.id] = section.items.map((x) => {
          return {
            type: "simpleCarouselItem",
            title: x.title,
            subtitle: x.subtitle,
            mangaId: x.mangaId,
            imageUrl: x.image,
          };
        });
      }
    });

    return discoverSections;
  }

  async getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: unknown | undefined,
  ): Promise<PagedResults<DiscoverSectionItem>> {
    const cachedItems = this.homepageItemCache[section.id];
    if (cachedItems) {
      return { items: cachedItems };
    }

    const result = await this.legacySource.getViewMoreItems?.(
      section.id,
      metadata,
    );

    if (result) {
      return {
        items: result.results.map((x) => {
          return {
            type: "simpleCarouselItem",
            title: x.title,
            subtitle: x.subtitle,
            mangaId: x.mangaId,
            imageUrl: x.image,
          };
        }),
        metadata: result.metadata,
      };
    } else {
      return EndOfPageResults;
    }
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const legacyManga = await this.legacySource.getMangaDetails(mangaId);

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
    };
  }

  async getSearchFilters(): Promise<SearchFilter[]> {
    const searchFilters: SearchFilter[] = [];
    const legacyFilters = this.legacySource.getSearchTags ? await this.legacySource.getSearchTags() : [];

    for (const filter of legacyFilters) {
      searchFilters.push({
        id: filter.id,
        title: filter.label,
        type: "multiselect",
        options: filter.tags.map((x) => {
          return { id: x.id, value: x.label };
        }),
        value: {},
        allowExclusion: true,
        allowEmptySelection: true,
        maximum: undefined,
      });
    }

    return searchFilters;
  }

  async getSearchResults(
    query: SearchQuery,
    metadata: unknown | undefined,
  ): Promise<PagedResults<SearchResultItem>> {
    const legacyQuery: LegacySearchRequest = {
      title: query.title,
      includedTags: [],
      excludedTags: [],
      parameters: {},
    };

    for (const filter of query.filters) {
      if (typeof filter.value === "string") {
        legacyQuery.parameters[filter.id] = filter.value;
      } else {
        for (const tag of Object.keys(filter.value)) {
          if (filter.value[tag] === "included") {
            legacyQuery.includedTags.push({ id: tag, label: tag });
          } else {
            legacyQuery.excludedTags.push({ id: tag, label: tag });
          }
        }
      }
    }

    const legacyResults = await this.legacySource.getSearchResults(
      legacyQuery,
      metadata,
    );

    return {
      items: legacyResults.results.map((x) => {
        return {
          imageUrl: x.image,
          title: x.title,
          mangaId: x.mangaId,
          subtitle: x.subtitle,
        };
      }),
      metadata: legacyResults.metadata,
    };
  }

  async getChapters(
    sourceManga: SourceManga,
    sinceDate?: Date,
  ): Promise<Chapter[]> {
    const legacyChapters = await this.legacySource.getChapters(
      sourceManga.mangaId,
    );

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
      };
    });
  }

  async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
    return await this.legacySource.getChapterDetails(
      chapter.sourceManga.mangaId,
      chapter.chapterId,
    );
  }

  async getSettingsForm(): Promise<Form> {
    if (this.legacySource.getSourceMenu) {
      let rootSection = await this.legacySource.getSourceMenu();
      return new _CompatForm({
        async sections() {
          return [rootSection];
        },
      });
    } else {
      throw new Error("Not Supported");
    }
  }
}

class _CompatSection implements FormSectionElement {
  id: string;
  header?: string
  footer?: string

  bindingValueCache: Record<string, any> = {};
  items: FormItemElement<unknown>[] = [];
  proxies: Record<string, any> = {};

  constructor(private form: _CompatForm, private section: DUISection) {
    this.id = section.id;
    this.header = section.header
    this.footer = section.footer
    
    this.reloadRows();
  }

  reloadRows() {
    const newItems: FormItemElement<unknown>[] = [];
    this.items = newItems;
    console.log("reloadForm CALLED FROM reloadRows");
    this.form.reloadForm();

    this.section.rows().then((rows) => {
      if (this.items !== newItems) return;
      newItems.push(
        ...rows.map((row: any) => {
          const rowId = row["id"] as string ?? "unknown";

          switch (row["type"]) {
            case "DUIHeader": {
              const header = row as DUIHeader;
              return LabelRow(rowId, {
                title: header.title,
                subtitle: header.subtitle,
              });
            }

            case "DUILabel":
            case "DUIMultilineLabel": {
              const label = row as (DUILabel | DUIMultilineLabel);
              return LabelRow(rowId, {
                title: label.label,
                subtitle: label.value,
              });
            }

            case "DUIOAuthButton": {
              const button = row as DUIOAuthButton;
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
                  "successHandler",
                ),
              });
            }

            case "DUIButton": {
              const button = row as DUIButton;
              return ButtonRow(rowId, {
                title: button.label,
                onSelect: this.proxifiedClosureSelector(
                  rowId,
                  button,
                  "onTap",
                ),
              });
            }

            case "DUISecureInputField":
            case "DUIInputField": {
              const input = row as (DUIInputField | DUISecureInputField);
              input.value.get().then((value) => {
                if (this.bindingValueCache[rowId] !== value) {
                  console.log(
                    `NEW VALUE BY ${rowId}, ${
                      this.bindingValueCache[rowId]
                    }, ${value}`,
                  );
                  this.bindingValueCache[rowId] = value;
                  this.reloadRows();
                }
              }).catch((e) => {
                console.log("ERROR:" + e);
              });

              return InputRow(rowId, {
                title: input.label,
                value: this.bindingValueCache[rowId] ?? "",
                onValueChange: this.proxifiedClosureSelector(
                  rowId,
                  input.value,
                  "set",
                ),
              });
            }

            case "DUINavigationButton": {
              const button = row as DUINavigationButton;
              return NavigationRow(rowId, {
                title: button.label,
                form: new _CompatForm(button.form),
              });
            }

            case "DUISwitch": {
              const toggle = row as DUISwitch;
              toggle.value.get().then((value) => {
                console.log("NEW VALUE: " + value);
                if (this.bindingValueCache[rowId] !== value) {
                  console.log(
                    `NEW VALUE BY ${rowId}, ${
                      this.bindingValueCache[rowId]
                    }, ${value}`,
                  );
                  this.bindingValueCache[rowId] = value;
                  this.reloadRows();
                }
              }).catch((e) => {
                console.log("ERROR:" + e);
              });

              return ToggleRow(rowId, {
                title: toggle.label,
                value: this.bindingValueCache[rowId] ?? false,
                onValueChange: this.proxifiedClosureSelector(
                  rowId,
                  toggle.value,
                  "set",
                ),
              });
            }

            default: {
              return LabelRow(rowId, {
                title: "Unsupported 0.8 Row",
                subtitle: `ID: ${rowId};\nType: ${row["type"]}`,
              });
            }
          }
        }),
      );
      this.form.reloadForm();
    }).catch((e) => {
      console.log("ERROR:" + e);
    });
  }

  proxifiedClosureSelector<T>(
    id: string,
    obj: any,
    method: string,
  ): SelectorID<T> {
    const form = this;

    const key = "__proxied_" + method;
    this.proxies[id] = Object.defineProperty(obj, key, {
      enumerable: true,
      value: function() {
        const ret = obj[method](...arguments);
        console.log(`CALLING ${method} WITH ${JSON.stringify(arguments)}`);

        if (ret.then) {
          ret.then((_: any) => form.reloadRows());
        } else {
          form.reloadRows();
        }

        return ret;
      },
    });

    return Application.Selector(
      this.proxies[id],
      key,
    );
  }
}

class _CompatForm extends Form {
  private sections: FormSectionElement[] = [];

  constructor(private form: DUIForm) {
    super();
  }

  override getSections(): FormSectionElement[] {
    if (this.sections.length == 0) {
      return [Section("loading", [
        LabelRow("loading", {
          title: "Loading Sections...",
        }),
      ])];
    }

    return this.sections;
  }

  reloadSections() {
    const newSections: FormSectionElement[] = [];
    this.sections = newSections;
    console.log("reloadForm CALLED FROM reloadSections");
    this.reloadForm();

    this.form.sections().then((sections) => {
      if (this.sections !== newSections) return;
      this.sections.push(...sections.map((section) => {
        return new _CompatSection(this, section);
      }));

      this.reloadForm();
    });
  }

  formWillAppear(): void {
    this.reloadSections()
  }
}

type CompatWrapperInfo = {
  registerHomeSectionsInInitialise: boolean;
};

export function CompatWrapper(
  info: CompatWrapperInfo,
  legacySource: Source,
  newSource: Extension | undefined = undefined,
): Extension {
  const wrapper = new _CompatWrapper(legacySource);

  // @ts-ignore
  return new Proxy(newSource ?? {}, {
    has(target, p) {
      console.log(`[COMPAT] has CALLED WITH '${p.toString()}'`);
      // @ts-ignore
      return target[p] !== undefined || wrapper[p] !== undefined;
    },
    get(target, p, receiver) {
      console.log(`[COMPAT] get CALLED WITH '${p.toString()}'`);

      if (typeof p === "string" && p === "initialise") {
        return async () => {
          if (info.registerHomeSectionsInInitialise) {
            await wrapper.initialise();
          }

          // @ts-ignore
          await target[p]?.();
        };
      }

      // @ts-ignore
      if (target[p]) {
        // @ts-ignore
        return target[p];
      } // @ts-ignore
      else if (wrapper[p]) {
        // @ts-ignore
        return wrapper[p];
      }

      return undefined;
    },
  });
}
