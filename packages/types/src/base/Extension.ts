import { SourceManga } from "../generated/_exports"

export interface Extension {
    initialise(): Promise<void>
}