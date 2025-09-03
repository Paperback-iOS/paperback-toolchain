import type { Chapter } from '../../Chapter.js'
import type { ChapterDetails } from '../../ChapterDetails.js'
import type { SourceManga } from '../../SourceManga.js'
import { hasPropertiesOf } from './index.js'
import type { MangaProviding } from './MangaProviding.js'

export interface ChapterProviding extends MangaProviding {
  /**
   * @param sourceManga The sourceManga for which the chapters should be fetched
   */
  getChapters(sourceManga: SourceManga, sinceDate?: Date): Promise<Chapter[]>

  /**
   * @param chapter The chapter listing for which the details should be fetched
   */
  getChapterDetails(chapter: Chapter): Promise<ChapterDetails>

  /**
   * Implement this ONLY if the source can determine, in bulk, which title has been updated
   * You can also use this to skip the app calling {@link getNewChapters} entirely and provide new
   * chapter in here
   * @param updateManager the update manager which will be responsible for fetching updates, DO NOT STORE THIS
   * @param lastUpdateDate last time the app successfully fetched updates
   * 
   * Notes:
   * - If your source needs cloudflare bypass throw a {@link CloudflareError} here
   */
  processTitlesForUpdates?(
    updateManager: UpdateManager,
    lastUpdateDate?: Date
  ): Promise<void>
}

export interface UpdateManager {
  getQueuedItems(): SourceManga[]

  setUpdatePriority(
    mangaId: string,
    updatePriority: 'high' | 'low' | 'skip'
  ): Promise<void>

  getNumberOfChapters(mangaId: string): Promise<number>

  /**
   * Get all chapters for a title from app db
   * 
   * This can potentially be a really expensive call, only perform this when you know you'll be saving many requests.
   *
   * In general, avoid doing diffing in the source and let the app handle merging chapters.
   *
   * A potential use-case for this method is determining what the sort-index is for the new chapters
   */
  getChapters(mangaId: string): Promise<Chapter[]>

  /**
   * Provide new chapters for the given manga upfront, skipping its `getChapters` call.
   *
   * Note:
   * - if source sets `sortingIndex`, make sure it is set correctly for the new chapters.
   * - Only use this if it's a more efficient call than `ChapterProviding.getChapters`
   */
  setNewChapters(
    mangaId: string,
    chapters: Chapter[] | undefined
  ): Promise<void>
}

export function implementsChapterProviding(
  extension: MangaProviding
): extension is ChapterProviding {
  return hasPropertiesOf<ChapterProviding>(
    ['getChapters', 'getMangaDetails'],
    extension
  )
}
