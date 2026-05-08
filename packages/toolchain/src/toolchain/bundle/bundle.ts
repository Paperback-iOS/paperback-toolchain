import { Listr } from 'listr2'
import { build, type BuildOptions } from 'rolldown'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import cliInfo from '../../../package.json' with { type: 'json' }

export async function bundleSources(
  folder = '',
  sourcemap = false,
  tests = false
) {
  const cwd = process.cwd()

  const srcDir = path.join(cwd, 'src')
  // const tmpDir = path.join(cwd, 'tmp')
  const bundlesDirPath = path.join(cwd, 'bundles', folder)

  return new Listr([
    {
      title: 'Transpiling Project',
      async task() {
        fs.rmSync(bundlesDirPath, { recursive: true, force: true })

        const buildSpecs: { entry: string; outFile: string }[] = []
        for (const file of fs.readdirSync(srcDir)) {
          const pbConfigPath = path.join(srcDir, file, 'pbconfig.ts')
          const hasPBConfig = fs.existsSync(pbConfigPath)

          const mainFilePath = path.join(srcDir, file, 'main.ts')
          const hasMainFile = fs.existsSync(mainFilePath)

          if (!hasMainFile || !hasPBConfig) {
            continue
          }

          buildSpecs.push({
            entry: mainFilePath,
            outFile: path.join(bundlesDirPath, file, 'index.js'),
          })

          if (tests) {
            const testDir = path.join(srcDir, 'tests')
            if (!fs.existsSync(testDir)) {
              fs.mkdirSync(testDir)
            }

            const testFilePath = path.join(testDir, `${file}.ts`)
            if (fs.existsSync(testFilePath)) {
              buildSpecs.push({
                entry: testFilePath,
                outFile: path.join(bundlesDirPath, file, 'test.js'),
              })
            }
          }
        }

        await build(
          buildSpecs.map(
            ({ entry, outFile }): BuildOptions => ({
              input: entry,
              cwd,
              transform: { target: 'es2020' },
              output: {
                file: outFile,
                format: 'iife',
                name: 'source',
                minify: !sourcemap,
                sourcemap: sourcemap ? 'inline' : false,
              },
            })
          )
        )
      },
    },
    {
      title: 'Generate SourceInfo',
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
                  fs.cpSync(
                    path.join(srcDir, file, 'static'),
                    path.join(bundleDestinationDir, 'static'),
                    { recursive: true }
                  )

                  // await this.bundleExtension(file, sourceDir, bundleDestinationDir)
                  await generateSourceInfo(
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
    },
    {
      title: 'Cleaning up',
      task() {},
    },
  ])
}

export async function generateHomepage(folder = '') {
  const indexPath = path.join(
    import.meta.dirname,
    './pages/homepage.template.html'
  )

  const basePath = process.cwd()
  const directoryPath = path.join(basePath, 'bundles', folder, 'index.html')
  fs.copyFileSync(indexPath, directoryPath)
}

export async function generateSourceInfo(
  sourceId: string,
  sourceDirectory: string,
  directoryPath: string
) {
  const directoryContainsExtensionDefinition = fs.existsSync(
    path.join(sourceDirectory, 'pbconfig.ts')
  )
  if (!directoryContainsExtensionDefinition) return

  const configPath = path.join(sourceDirectory, 'pbconfig.ts')

  let configBundle
  try {
    configBundle = await build({
      input: configPath,
      cwd: process.cwd(),
      treeshake: true,
      output: { format: 'esm' },
      write: false,
    })
  } catch (error) {
    console.log(
      `[ERROR] ${error instanceof Error ? error.message : String(error)}`
    )
    return
  }

  const configModule = await import(
    `data:text/javascript;base64,${Buffer.from(configBundle.output[0].code).toString('base64')}`
  )
  const config = configModule.default
  config.id = sourceId

  // Write the JSON payload to file
  fs.writeFileSync(
    path.join(directoryPath, 'info.json'),
    JSON.stringify(config)
  )
}

export async function generateVersioningFile(folder = '') {
  // joining path of directory
  const basePath = process.cwd()
  const directoryPath = path.join(basePath, 'bundles', folder)
  const commonsInfo = await import(
    path.join(basePath, 'node_modules/@paperback/types/package.json'),
    { with: { type: 'json' } }
  )

  let projectInfo

  try {
    projectInfo = await import(path.join(basePath, 'package.json'), {
      with: { type: 'json' },
    })
  } catch {
    try {
      projectInfo = await import(path.join(basePath, 'deno.json'), {
        with: { type: 'json' },
      })
    } catch {
      throw new Error('No package.json or deno.json was found')
    }
  }

  const jsonObject = {
    buildTime: new Date(),
    builtWith: {
      toolchain: cliInfo.version,
      types: commonsInfo.default.version,
    },
    repository: {
      name: projectInfo.default?.name ?? 'Paperback Extension Repository',
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
