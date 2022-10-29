import { DUIForm, MangaProgress, TrackerActionQueue } from "../../generated/_exports";

export interface MangaProgressProviding {
	getMangaProgressManagementForm(mangaId: string): Promise<DUIForm>
	getMangaProgress(mangaId: string): Promise<MangaProgress | undefined>

	processChapterReadActionQueue(actionQueue: TrackerActionQueue): Promise<void>
}