import { Chapter, SourceManga } from "../generated/_exports"
import { SearchQuery } from "./SearchQuery"

interface FeaturedCarouselItem {
    type: 'featuredCarouselItem',
    mangaId: string
    imageUrl: string
    title: string
    supertitle?: string
    metadata?: any
}

interface SimpleCarouselItem {
    type: 'simpleCarouselItem',
    mangaId: string
    imageUrl: string
    title: string
    subtitle?: string
    metadata?: any
}

interface ProminentCarouselItem {
    type: 'prominentCarouselItem',
    mangaId: string
    imageUrl: string
    title: string
    subtitle?: string
    metadata?: any
}

interface ChapterUpdatesCarouselItem {
    type: 'chapterUpdatesCarouselItem',
    mangaId: string
    chapterId: string
    imageUrl: string
    title: string
    subtitle?: string
    publishDate?: Date
    metadata?: any
}

interface GenresCarouselItem {
    type: 'genresCarouselItem',
    searchQuery: SearchQuery
    name: string
    metadata?: any
}

export type DiscoverSectionItem = 
    FeaturedCarouselItem |
    SimpleCarouselItem | 
    ProminentCarouselItem |
    ChapterUpdatesCarouselItem |
    GenresCarouselItem
