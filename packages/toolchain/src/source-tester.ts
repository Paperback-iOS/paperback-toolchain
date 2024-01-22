
import '@paperback/runtime-polyfills'
import {HomeSection, HomePageSectionsProviding, ChapterProviding, MangaProviding, SearchResultsProviding} from '@paperback/types'
import {SourceInstallRequest, SourceTestRequest, SourceTestResponse} from './devtools/generated/typescript/PDTSourceTester'
import * as path from 'node:path'
import cheerio from 'cheerio'
import {TestData} from './devtools/generated/typescript/PDTSourceTester'
import {PaperbackSourceTesterClient} from './devtools/generated/typescript/PDTSourceTester.grpc-client'
import fs from 'node:fs'
import {expect} from 'chai'

export interface ISourceTester {
  testSource(request: SourceTestRequest, callback: (response: SourceTestResponse) => Promise<void>): Promise<void>
}

export interface ISourceInstaller {
  installSource(request: SourceInstallRequest): Promise<void>
}

declare type TestCase = (testCase: string, runner: () => Promise<void>) => Promise<void>

export class SourceTester implements ISourceTester {
  // eslint-disable-next-line no-useless-constructor
  constructor(private bundleDir: string) {}

  async testSource(request: SourceTestRequest, callback: (response: SourceTestResponse) => Promise<void>): Promise<void> {
    const testData = request.data ?? {}

    const sourceFilePath = path.join(this.bundleDir, request.sourceId, request.sourceId)
    const sourceFile = require(sourceFilePath)
    const source: unknown = new sourceFile[request.sourceId](cheerio)

    const testCase: TestCase = async (testCase: string, runner) => {
      try {
        callback({
          testCase,
          failures: [],
          completeTime: BigInt(await this.measureTime(async () => {
            await runner()
          })),
        })
      } catch (error: any) {
        if (typeof error === 'string') {
          callback({testCase, completeTime: 0n, failures: [error]})
        } else if (typeof error === 'object' && error.message) {
          callback({testCase, completeTime: 0n, failures: [error.message]})
        }
      }
    }

    const customRunnerPath = path.join(process.cwd(), 'src', request.sourceId, `${request.sourceId}.test.js`)
    if (fs.existsSync(customRunnerPath)) {
      const customRunner = require(customRunnerPath)
      if (customRunner.runTests) {
        await customRunner.runTests(testCase, testData, source, this.runTests.bind(this))
        return
      }
    }

    this.runTests(testCase, testData, source)
  }

  async runTests(testCase: TestCase, testData: TestData, source: unknown) {
    const homepageProvider = source as (HomePageSectionsProviding | undefined)
    if (homepageProvider?.getHomePageSections) {
      await testCase('source should return homepage sections containing items', async () => {
        const sections: Record<string, HomeSection> = {}
        await homepageProvider.getHomePageSections(section => {
          sections[section.id] = section
        })

        const sectionKeys = Object.keys(sections)
        for (const key of sectionKeys) {
          expect(sections[key].items, `section[${key}] has no items`).to.not.be.empty

          if (!testData.mangaId) {
            testData.mangaId = sections[key].items[0].mangaId
          }

          if (!testData.searchData) {
            testData.searchData = {
              query: sections[key].items[0].title,
              excludedTags: [],
              includedTags: [],
            }
          }
        }
      })
    }

    const mangaProvider = source as (MangaProviding | undefined)
    if (mangaProvider?.getMangaDetails) {
      await testCase('source should return valid SourceManga definition', async () => {
        expect(testData.mangaId, 'no mangaId provided and could not infer it from homepage').to.exist

        const sourceManga = await mangaProvider.getMangaDetails(testData.mangaId!)
        expect(sourceManga.id, 'returned manga id does not match the queried manga id').to.equal(testData.mangaId)
        expect(sourceManga.mangaInfo, 'MangaInfo does not exist').to.exist
      })
    }

    const chapterProvider = source as (ChapterProviding | undefined)
    if (chapterProvider?.getChapters) {
      await testCase('source should return some chapters', async () => {
        expect(testData.mangaId, 'no mangaId provided and could not infer it from homepage').to.exist

        const chapters = await chapterProvider.getChapters(testData.mangaId!)
        expect(chapters, `one or more chapters should be returned for manga '${testData.mangaId}'`).to.not.be.empty
        if (!testData.chapterId) {
          testData.chapterId = chapters[0].id
        }
      })
    }

    if (chapterProvider?.getChapterDetails) {
      await testCase('source should return chapter details with some pages', async () => {
        expect(testData.mangaId, 'no mangaId provided and could not infer it from homepage').to.exist
        expect(testData.chapterId, 'no chapterId provided and could not infer it from chapter list').to.exist

        const chapterDetails = await chapterProvider.getChapterDetails(testData.mangaId!, testData.chapterId!)
        expect(chapterDetails.id, 'returned chapter id does not match the queried chapter id').to.equal(testData.chapterId)
        expect(chapterDetails.mangaId, 'returned manga id does not match the queried manga id').to.equal(testData.mangaId)
        expect(chapterDetails.pages, 'chapter must have pages').to.not.be.empty
      })
    }

    const searchResultsProvider = source as (SearchResultsProviding | undefined)
    if (searchResultsProvider?.getSearchResults) {
      await testCase('source should return some search results', async () => {
        expect(testData.searchData, 'no searchData provided and could not infer it from homepage').to.exist

        const searchResults = await searchResultsProvider?.getSearchResults({
          title: testData.searchData!.query ?? '',
          excludedTags: testData.searchData!.excludedTags?.map(x => ({id: x, label: x})) ?? [],
          includedTags: testData.searchData!.includedTags?.map(x => ({id: x, label: x})) ?? [],
          parameters: {},
        }, {})
        expect(searchResults.results, `one or more search results should be returned for ${JSON.stringify(testData.searchData)}`).to.not.be.empty
      })
    }
  }

  async measureTime(closure: () => Promise<void>): Promise<number> {
    const startTime = process.hrtime.bigint()
    await closure()
    const endTime = Number(process.hrtime.bigint() - startTime)
    return Math.ceil(endTime / 1_000_000)
  }
}

export class OnDeviceSourceTester implements ISourceTester, ISourceInstaller {
  // eslint-disable-next-line no-useless-constructor
  constructor(private grpcClient: PaperbackSourceTesterClient) {}

  async installSource(request: SourceInstallRequest): Promise<void> {
    await new Promise((resolve, reject) => {
      this.grpcClient.installSource(
        request,
        (error, response) => (error) ?
          reject(error) :
          resolve(response),
      )
    })
  }

  async testSource(request: SourceTestRequest, callback: (response: SourceTestResponse) => Promise<void>): Promise<void> {
    await new Promise((resolve, reject) => {
      this.grpcClient.testSource(request)
      .on('end', resolve)
      .on('error', reject)
      .on('data', callback)
    })
  }
}
