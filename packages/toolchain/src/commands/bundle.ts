import { Command, Flags } from '@oclif/core'
import { Listr, color } from 'listr2'

import esbuild from 'esbuild'
import fs from 'fs-extra'
import path from 'path'

export default class Bundle extends Command {
  static override description =
    'Builds all the sources in the repository and generates a versioning file'

  static override flags = {
    folder: Flags.string({
      description: 'Subfolder to output to',
      required: false,
    }),
    help: Flags.help({ char: 'h' }),
    debug: Flags.boolean(),
    tests: Flags.boolean(),
  }

  async bundleSources(folder = '', sourcemap = false, tests = false) {
    const cwd = process.cwd()

    const srcDir = path.join(cwd, 'src')
    // const tmpDir = path.join(cwd, 'tmp')
    const bundlesDirPath = path.join(cwd, 'bundles', folder)

    return new Listr([
      {
        async task() {
          // await fs.remove(tmpDir)
          await fs.remove(bundlesDirPath)

          const files: { in: string; out: string }[] = []
          for (const file of fs.readdirSync(srcDir)) {
            const pbConfigPath = path.join(srcDir, file, 'pbconfig.ts')
            const hasPBConfig = fs.existsSync(pbConfigPath)

            const mainFilePath = path.join(srcDir, file, 'main.ts')
            const hasMainFile = fs.existsSync(mainFilePath)

            if (!hasMainFile || !hasPBConfig) {
              continue
            }

            files.push({
              in: mainFilePath,
              out: path.join(file, 'index'),
            })

            if (tests) {
              const testDir = path.join(srcDir, 'test')
              if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir)
              }

              const testFilePath = path.join(testDir, `${file}.ts`)
              const hasTestFile = fs.existsSync(testFilePath)
              if (!hasTestFile) {
                const defaultTestFile = `
import { TestSuite, registerDefaultTests } from '@paperback/types'
import { ${file} } from '../${file}/main'
import sourceInfo from '../${file}/pbconfig'

export async function runTests() {
  const suite = new TestSuite('${file} tests')
  registerDefaultTests(suite, ${file}, sourceInfo)
  
  await suite.run()
}
                `

                fs.writeFileSync(testFilePath, defaultTestFile)
              }

              files.push({
                in: testFilePath,
                out: path.join(file, 'test'),
              })
            }
          }

          const result = await esbuild.build({
            bundle: true,
            entryPoints: files,
            format: 'iife',
            target: 'ES2020',
            globalName: 'source',
            metafile: true,
            outdir: bundlesDirPath,
            inject: [path.join(import.meta.dirname, '../shims/buffer.js')],
            minify: !sourcemap,
            sourcemap: sourcemap ? 'inline' : undefined,
            absWorkingDir: cwd,
          })

          fs.writeFileSync(
            path.join(bundlesDirPath, 'metafile.json'),
            JSON.stringify(result.metafile)
          )
        },
        title: 'Transpiling Project',
      },
      {
        task: () =>
          new Listr(
            fs
              .readdirSync(bundlesDirPath)
              .filter((file) =>
                fs.existsSync(path.join(bundlesDirPath, file, 'index.js'))
              )
              .map((file) => {
                const sourceDir = path.join(srcDir, file)
                const bundleDestinationDir = path.join(bundlesDirPath, file)

                return {
                  task: async () => {
                    await fs.copy(
                      path.join(srcDir, file, 'static'),
                      path.join(bundleDestinationDir, 'static')
                    )

                    // await this.bundleExtension(file, sourceDir, bundleDestinationDir)
                    await this.generateSourceInfo(
                      file,
                      sourceDir,
                      bundleDestinationDir
                    )
                  },
                  title: file,
                }
              }),
            { concurrent: true }
          ),
        title: 'Bundling Extensions',
      },
      {
        task() {
          // fs.remove(path.join(cwd, 'tmp'))
        },
        title: 'Cleaning up',
      },
    ])
  }

  async generateHomepage(folder = '') {
    const indexPath = path.join(import.meta.dirname, '../homepage/index.html')

    const basePath = process.cwd()
    const directoryPath = path.join(basePath, 'bundles', folder, 'index.html')
    fs.copyFile(indexPath, directoryPath)
  }

  async generateSourceInfo(
    sourceId: string,
    sourceDirectory: string,
    directoryPath: string
  ) {
    const directoryContainsExtensionDefinition = fs.existsSync(
      path.join(sourceDirectory, 'pbconfig.ts')
    )
    if (!directoryContainsExtensionDefinition) return

    const configPath = path.join(sourceDirectory, 'pbconfig.ts')

    const configBundle = esbuild.buildSync({
      bundle: true,
      entryPoints: [configPath],
      format: 'esm',
      write: false,
      treeShaking: true,
    })

    if (configBundle.errors.length > 0) {
      for (const error of configBundle.errors) {
        this.log(`[ERROR] ${error.text}`)
      }

      return
    }

    const configModule = await import(
      `data:text/javascript;base64,${Buffer.from(
        configBundle.outputFiles[0]!.text
      ).toString('base64')}`
    )
    const config = configModule.default
    config.id = sourceId

    // Write the JSON payload to file
    fs.writeFileSync(
      path.join(directoryPath, 'info.json'),
      JSON.stringify(config)
    )
  }

  async generateVersioningFile(folder = '') {
    // joining path of directory
    const basePath = process.cwd()
    const directoryPath = path.join(basePath, 'bundles', folder)
    const cliInfo = await import('../../package.json', {
      with: { type: 'json' },
    })
    const commonsInfo = await import(
      path.join(basePath, 'node_modules/@paperback/types/package.json'),
      { with: { type: 'json' } }
    )
    const projectInfo = await import(path.join(basePath, 'package.json'), {
      with: { type: 'json' },
    })

    const jsonObject = {
      buildTime: new Date(),
      builtWith: {
        toolchain: cliInfo.default.version,
        types: commonsInfo.default.version,
      },
      repository: {
        name:
          projectInfo.default?.repositoryName ??
          'Paperback Extension Repository',
        description:
          projectInfo.default?.description ??
          'An extension repository for Paperback',
      },
      sources: [] as unknown[],
    }

    for (const file of fs.readdirSync(directoryPath)) {
      const infoJsonPath = path.join(directoryPath, file, 'info.json')
      const directoryContainsExtensionDefinition = fs.existsSync(infoJsonPath)
      if (!directoryContainsExtensionDefinition) continue

      const infoModule = await import(`file://${infoJsonPath}`, {
        with: { type: 'json' },
      })
      jsonObject.sources.push(infoModule.default)
    }

    // Write the JSON payload to file
    fs.writeFileSync(
      path.join(directoryPath, 'versioning.json'),
      JSON.stringify(jsonObject, null, 2)
    )
  }

  async run() {
    const { flags } = await this.parse(Bundle)

    this.log(`Working directory: ${process.cwd()}\n`)

    const tasks = new Listr(
      [
        {
          task: async () =>
            await this.bundleSources(flags.folder, flags.debug, flags.tests),
          title: 'Bundle Sources',
        },
        {
          task: async () => await this.generateVersioningFile(flags.folder),
          title: 'Generate Versioning File',
        },
        {
          task: async () => await this.generateHomepage(flags.folder),
          title: 'Generate Homepage',
        },
      ],
      {
        rendererOptions: {
          collapseSubtasks: false,
          timer: {
            condition: true,
            field(duration) {
              const seconds = Math.floor(duration / 1e3)
              const minutes = Math.floor(seconds / 60)
              let parsedTime
              if (seconds === 0 && minutes === 0) {
                parsedTime = `${Math.floor(duration)}ms`
              }

              if (seconds > 0) {
                parsedTime = `${seconds % 60}s`
              }

              if (minutes > 0) {
                parsedTime = `${minutes}m${parsedTime}`
              }

              return parsedTime ?? '0.0s'
            },
            // @ts-expect-error type shenanigans
            format: () => color.dim,
          },
        },
      }
    )

    await tasks.run()
  }
}
