import { MangaProgress } from "../../MangaProgress"
import { SourceManga } from "../../SourceManga"
import { TrackedMangaChapterReadAction } from "../../TrackedMangaChapterReadAction"
import { Form } from "../SettingsUI"

export interface MangaProgressProviding {
    getMangaProgressManagementForm(sourceManga: SourceManga): Promise<Form>
    getMangaProgress(sourceManga: SourceManga): Promise<MangaProgress | undefined>

    processChapterReadActionQueue(actions: TrackedMangaChapterReadAction[]): Promise<void>
}
