import type { ChapterProviding } from './interfaces/ChapterProviding.js';
import type { CloudflareBypassRequestProviding } from './interfaces/CloudflareBypassRequestProviding.js';
import type { DiscoverSectionProviding } from './interfaces/DiscoverSectionProviding.js';
import type { ManagedCollectionProviding } from './interfaces/ManagedCollectionProviding.js';
import type { MangaProgressProviding } from './interfaces/MangaProgressProviding.js';
import type { MangaProviding } from './interfaces/MangaProviding.js'
import type { SearchResultsProviding } from './interfaces/SearchResultsProviding.js';
import type { SettingsFormProviding } from './interfaces/SettingsFormProviding.js';
import type { SourceIntents } from './SourceInfo.js';

type _IntentHandlerMap<K extends {
    [x in SourceIntents]: unknown;
}> = K

type IntentHandlerMap = _IntentHandlerMap<{
    [SourceIntents.SEARCH_RESULT_PROVIDING]: SearchResultsProviding,
    [SourceIntents.CHAPTER_PROVIDING]: ChapterProviding,
    [SourceIntents.SETTINGS_FORM_PROVIDING]: SettingsFormProviding,
    [SourceIntents.CLOUDFLARE_BYPASS_PROVIDING]: CloudflareBypassRequestProviding,
    [SourceIntents.DISCOVER_SECTION_PROVIDING]: DiscoverSectionProviding,
    [SourceIntents.MANAGED_COLLECTION_PROVIDING]: ManagedCollectionProviding,
    [SourceIntents.PROGRESS_PROVIDING]: MangaProgressProviding,
    [SourceIntents.NONE]: never
}>

type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type BaseExtension = {
  initialise(): Promise<void>
}

export type Extension = BaseExtension & MangaProviding
export type ExtensionImpl<T extends { capabilities: readonly SourceIntents[] }> =
  Extension & UnionToIntersection<T["capabilities"][number] extends infer I
    ? I extends keyof IntentHandlerMap
      ? IntentHandlerMap[I]
      : never
    : never>;