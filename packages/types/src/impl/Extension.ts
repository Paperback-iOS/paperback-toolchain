import type { MangaProviding } from "./interfaces/MangaProviding.js"

interface _Extension {
  initialise(): Promise<void>
}

export type Extension = _Extension & MangaProviding