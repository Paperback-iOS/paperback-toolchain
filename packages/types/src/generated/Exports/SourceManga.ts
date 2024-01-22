import { ContentRating } from "../../base"
import { MangaInfo, TagSection } from "./../_exports"
export interface SourceManga {
	/*
	 * internalName: mangaId
	 */
	mangaId: string
	thumbnailUrl: string
	synopsis: string
	primaryTitle: string

	secondaryTitles?: string[]
	contentRating?: ContentRating
	status?: string
	artist?: string
	author?: string
	bannerUrl?: string
	rating?: number
	tagGroups?: TagSection[]
	artworkUrls?: string[]
	additionalInfo?: Record<string, string>
}