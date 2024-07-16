import { Command, Flags } from '@oclif/core'
import { Listr, color } from 'listr2'

import esbuild = require('esbuild')
import fs = require('fs-extra')
import path = require('path')

export default class Bundle extends Command {
    static override description = 'Builds all the sources in the repository and generates a versioning file'

    static override flags = {
        folder: Flags.string({
            description: 'Subfolder to output to',
            required: false
        }),
        help: Flags.help({ char: 'h' })
    }

    async bundleSources(folder = '') {
        const cwd = process.cwd()

        const srcDir = path.join(cwd, 'src')
        // const tmpDir = path.join(cwd, 'tmp')
        const bundlesDirPath = path.join(cwd, 'bundles', folder)

        return new Listr([
            {
                async task() {
                    // await fs.remove(tmpDir)
                    await fs.remove(bundlesDirPath)

                    const files = fs
                        .readdirSync(srcDir)
                        .filter(
                            (file) =>
                                fs.existsSync(path.join(srcDir, file, 'pbconfig.ts')) &&
                                fs.existsSync(path.join(srcDir, file, 'main.ts'))
                        )
                        .flatMap((file) => [
                            {
                                in: path.join(srcDir, file, 'main.ts'),
                                out: path.join(file, 'index')
                            }
                        ])

                    
                    const result = await esbuild.build({
                        bundle: true,
                        entryPoints: files,
                        format: 'iife',
                        globalName: 'source',
                        metafile: true,
                        outdir: bundlesDirPath,
                        inject: [path.join(__dirname,'../shims/buffer.js')],

                        // minify: true,
                        // sourcemap: "inline"
                    })

                    fs.writeFileSync(path.join(bundlesDirPath, 'metafile.json'), JSON.stringify(result.metafile))
                },
                title: 'Transpiling Project'
            },
            {
                task: () =>
                    new Listr(
                        fs
                            .readdirSync(bundlesDirPath)
                            .filter((file) => fs.existsSync(path.join(bundlesDirPath, file, 'index.js')))
                            .map((file) => {
                                const sourceDir = path.join(srcDir, file)
                                const bundleDestinationDir = path.join(bundlesDirPath, file)

                                return {
                                    task: async () => {
                                        await fs.copy(path.join(srcDir, file, 'static'), path.join(bundleDestinationDir, 'static'))

                                        // await this.bundleExtension(file, sourceDir, bundleDestinationDir)
                                        await this.generateSourceInfo(file, sourceDir, bundleDestinationDir)
                                    },
                                    title: file
                                }
                            }),
                        { concurrent: true }
                    ),
                title: 'Bundling Extensions'
            },
            {
                task() {
                    // fs.remove(path.join(cwd, 'tmp'))
                },
                title: 'Cleaning up'
            }
        ])
    }

    async generateHomepage(folder = '') {
        const indexPath = path.join(__dirname, '../homepage/index.html')

        const basePath = process.cwd()
        const directoryPath = path.join(basePath, 'bundles', folder, 'index.html')
        fs.copyFile(indexPath, directoryPath)
    }

    async generateSourceInfo(sourceId: string, sourceDirectory: string, directoryPath: string) {
        const directoryContainsExtensionDefinition = fs.existsSync(path.join(sourceDirectory, 'pbconfig.ts'))
        if (!directoryContainsExtensionDefinition) return

        const configPath = path.join(sourceDirectory, 'pbconfig.ts')

        const configBundle = esbuild.buildSync({
            bundle: true,
            entryPoints: [configPath],
            format: 'cjs',
            write: false,
            treeShaking: true
        })

        if (configBundle.errors.length > 0) {
            for (const error of configBundle.errors) {
                this.log(`[ERROR] ${error.text}`)
            }

            return
        }

        // eslint-disable-next-line no-eval
        const config = eval(configBundle.outputFiles[0].text).default
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
        const cliInfo = require('../../package.json')
        const commonsInfo = require(path.join(basePath, 'node_modules/@paperback/types/package.json'))
        const projectInfo = require(path.join(basePath, 'package.json'))

        const jsonObject = {
            buildTime: new Date(),
            builtWith: {
                toolchain: cliInfo.version,
                types: commonsInfo.version
            },
            repository: {
                description: projectInfo.paperback?.repositoryDescription ?? 'An extension repository for Paperback',
                name: projectInfo.paperback?.repositoryName ?? 'Paperback Extension Repository'
            },
            sources: [] as any[]
        }

        for (const file of fs.readdirSync(directoryPath)) {
            const infoJsonPath = path.join(directoryPath, file, 'info.json')
            const directoryContainsExtensionDefinition = fs.existsSync(infoJsonPath)
            if (!directoryContainsExtensionDefinition) continue

            jsonObject.sources.push(require(infoJsonPath))
        }

        // Write the JSON payload to file
        fs.writeFileSync(path.join(directoryPath, 'versioning.json'), JSON.stringify(jsonObject, null, 2))
    }

    async run() {
        const { flags } = await this.parse(Bundle)

        this.log(`Working directory: ${process.cwd()}\n`)

        const tasks = new Listr(
            [
                {
                    task: async () => await this.bundleSources(flags.folder),
                    title: 'Bundle Sources'
                },
                {
                    task: async () => await this.generateVersioningFile(flags.folder),
                    title: 'Generate Versioning File'
                },
                {
                    task: async () => await this.generateHomepage(flags.folder),
                    title: 'Generate Homepage'
                }
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
                        format: () => color.dim
                    }
                }
            }
        )

        await tasks.run()
    }
}
