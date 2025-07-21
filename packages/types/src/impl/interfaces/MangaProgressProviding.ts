import type { MangaProgress } from '../../MangaProgress.js'
import type { SourceManga } from '../../SourceManga.js'
import type { TrackedMangaChapterReadAction } from '../../TrackedMangaChapterReadAction.js'
import { Form } from '../SettingsUI/Form.js'

export type ChapterReadActionQueueProcessingResult = {
  successfulItems: string[]
  failedItems: string[]
}

export interface MangaProgressProviding {
  getMangaProgressManagementForm(sourceManga: SourceManga): Promise<Form>
  getMangaProgress(sourceManga: SourceManga): Promise<MangaProgress | undefined>

  /**
   * Implementation Notes:
   *   - Handle all errors, throwing can cause issues
   *   - If a chapter action is pushed, it should be in either `successfulItems` or `failedItems`
   *   - Items not in either `ChapterReadActionQueueProcessingResult` fields will be seen as "not attempted"
   */
  processChapterReadActionQueue(
    actions: TrackedMangaChapterReadAction[]
  ): Promise<ChapterReadActionQueueProcessingResult>
}
