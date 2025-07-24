export * from './ChapterProviding.js'
export * from './CloudflareBypassRequestProviding.js'
export * from './DiscoverSectionProviding.js'
export * from './ManagedCollectionProviding.js'
export * from './MangaProgressProviding.js'
export * from './MangaProviding.js'
export * from './SearchResultsProviding.js'
export * from './SettingsFormProviding.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasPropertiesOf<T>(properties: (keyof T)[], obj: any): obj is T {
  return properties.every((k) => k in obj)
}