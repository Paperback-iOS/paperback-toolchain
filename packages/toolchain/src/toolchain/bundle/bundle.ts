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
  const bundlesDirPath = path.join(cwd, 'bundles', folder)

  fs.rmSync(bundlesDirPath, { recursive: true, force: true })

  const sources = fs.readdirSync(srcDir).filter((file) => {
    const hasPBConfig = fs.existsSync(path.join(srcDir, file, 'pbconfig.ts'))
    const hasMainFile = fs.existsSync(path.join(srcDir, file, 'main.ts'))
    return hasPBConfig && hasMainFile
  })

  const pbconfigCode = new Map<string, string>()

  return new Listr([
    {
      title: 'Transpiling Project',
      async task() {
        const buildSpecs: BuildOptions[] = []

        for (const file of sources) {
          buildSpecs.push({
            input: path.join(srcDir, file, 'main.ts'),
            cwd,
            transform: { target: 'es2020' },
            output: {
              file: path.join(bundlesDirPath, file, 'index.js'),
              format: 'iife',
              name: 'source',
              minify: !sourcemap,
              sourcemap: sourcemap ? 'inline' : false,
            },
          })

          if (tests) {
            const testDir = path.join(srcDir, 'tests')
            if (!fs.existsSync(testDir)) {
              fs.mkdirSync(testDir)
            }

            const testFilePath = path.join(testDir, `${file}.ts`)
            if (fs.existsSync(testFilePath)) {
              buildSpecs.push({
                input: testFilePath,
                cwd,
                transform: { target: 'es2020' },
                output: {
                  file: path.join(bundlesDirPath, file, 'test.js'),
                  format: 'iife',
                  name: 'source',
                  minify: !sourcemap,
                  sourcemap: sourcemap ? 'inline' : false,
                },
              })
            }
          }
        }

        // pbconfig builds are appended last so we can locate their results by offset.
        const pbconfigStart = buildSpecs.length
        for (const file of sources) {
          buildSpecs.push({
            input: path.join(srcDir, file, 'pbconfig.ts'),
            cwd,
            treeshake: true,
            output: { format: 'esm' },
            write: false,
          })
        }

        const results = await build(buildSpecs)
        const resultsArray = Array.isArray(results) ? results : [results]
        sources.forEach((file, i) => {
          const result = resultsArray[pbconfigStart + i]
          if (!result) {
            throw new Error(`Missing rolldown result for pbconfig ${file}`)
          }
          pbconfigCode.set(file, result.output[0].code)
        })
      },
    },
    {
      title: 'Generate SourceInfo',
      task: () =>
        new Listr(
          sources.map((file) => {
            const bundleDestinationDir = path.join(bundlesDirPath, file)

            return {
              title: file,
              task: async () => {
                fs.mkdirSync(bundleDestinationDir, { recursive: true })
                fs.cpSync(
                  path.join(srcDir, file, 'static'),
                  path.join(bundleDestinationDir, 'static'),
                  { recursive: true }
                )

                const code = pbconfigCode.get(file)
                if (code === undefined) {
                  throw new Error(`Missing pbconfig output for ${file}`)
                }
                const configModule = await import(
                  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
                )
                const config = configModule.default
                config.id = file

                fs.writeFileSync(
                  path.join(bundleDestinationDir, 'info.json'),
                  JSON.stringify(config)
                )
              },
            }
          }),
          { concurrent: true }
        ),
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
