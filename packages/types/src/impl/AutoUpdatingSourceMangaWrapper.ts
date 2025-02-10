import { Chapter } from "../Chapter";
import { SourceManga } from "../SourceManga";
import { Extension } from "./Extension";
import { ChapterProviding, MangaProviding } from "./interfaces";

type AutoUpdatingSourceMangaWrapperConfig = {
  interval: number;
};

export function AutoUpdatingSourceMangaWrapper<
  T extends Extension & MangaProviding & ChapterProviding,
>(
  target: T,
  config: AutoUpdatingSourceMangaWrapperConfig = {
    interval: 7 * 24 * 60 * 60 * 1000,
  },
): T {
  return new Proxy(target, {
    get(target, property, _) {
      switch (property) {
        case "getMangaDetails": {
          return (async function (
            this: T,
            mangaId: string,
          ): Promise<SourceManga> {
            const sourceManga = await this.getMangaDetails(mangaId);
            sourceManga.mangaInfo.additionalInfo = {
              ...(sourceManga.mangaInfo.additionalInfo ?? {}),
              lastUpdated: new Date().toJSON(),
            };

            return sourceManga;
          }).bind(target);
        }
        case "getChapters": {
          return (async function (
            this: T,
            sourceManga: SourceManga,
            sinceDate?: Date,
          ): Promise<Chapter[]> {
            const lastUpdated = new Date(
              sourceManga.mangaInfo.additionalInfo?.lastUpdated ??
                "1970-01-01T00:00:00.000Z",
            );

            if (Date.now() - lastUpdated.getTime() > config.interval) {
              const { mangaId: _, ...partialSourceManga } = await this
                .getMangaDetails(sourceManga.mangaId);

              Object.assign(sourceManga, partialSourceManga);
              sourceManga.mangaInfo.additionalInfo = {
                ...(sourceManga.mangaInfo.additionalInfo ?? {}),
                lastUpdated: new Date().toJSON(),
              };
            }

            return this.getChapters(sourceManga, sinceDate);
          }).bind(target);
        }
        default: {
          // @ts-expect-error
          return target[property];
        }
      }
    },
  });
}
