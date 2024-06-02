import { Flags } from '@oclif/core'
import { CLICommand } from '../command'
import * as path from 'node:path'
import * as fs from 'node:fs'

// import browserify from 'browserify'
import * as esbuild from 'esbuild'
import * as shelljs from 'shelljs'
import * as swc from '@swc/core'
import { BundleInput } from '@swc/core/spack'
import Utils from '../utils'

// Homepage generation requirement
const pug = require('pug')

export default class Bundle extends CLICommand {
  static override description =
    'Builds all the sources in the repository and generates a versioning file';

  static override flags = {
    help: Flags.help({ char: 'h' }),
    folder: Flags.string({ description: 'Subfolder to output to', required: false }),
    'use-node-fs': Flags.boolean({ description: 'For more info, check https://github.com/Paperback-iOS/paperback-toolchain/pull/4#issuecomment-1791566399', required: false }),
    'with-typechecking': Flags.boolean({ aliases: ['tsc'], description: 'Enable typechecking when transpiling typescript files', required: false, default: false }),
  };

  utils: Utils = undefined as any

  async run() {
    const { flags } = await this.parse(Bundle)

    this.utils = flags['use-node-fs'] ? new Utils(false) : new Utils(true)

    this.log(`Working directory: ${process.cwd()}`)
    this.log()

    const execTime = this.time('Execution time', Utils.headingFormat)
    await this.bundleSources(flags.folder, flags['with-typechecking'])

    const versionTime = this.time('Versioning File', Utils.headingFormat)
    await this.generateVersioningFile(flags.folder)
    versionTime.end()
    this.log()

    const homepageTime = this.time('Homepage Generation', Utils.headingFormat)
    await this.generateHomepage(flags.folder)
    homepageTime.end()
    this.log()

    execTime.end()
  }

  async generateVersioningFile(folder = '') {
    // joining path of directory
    const basePath = process.cwd()
    const directoryPath = path.join(basePath, 'bundles', folder)
    const cliInfo = require('../../package.json')
    const commonsInfo = require(path.join(basePath, 'node_modules/@paperback/types/package.json'))

    const jsonObject = {
      buildTime: new Date(),
      sources: [] as any[],
      builtWith: {
        toolchain: cliInfo.version,
        types: commonsInfo.version,
      },
    }

    const promises = fs.readdirSync(directoryPath).map(async file => {
      if (file.startsWith('.') || file.startsWith('tests')) return

      try {
        const time = this.time(`- Generating ${file} Info`)
        const sourceInfo = await this.generateSourceInfo(file, directoryPath)

        jsonObject.sources.push(sourceInfo)
        time.end()
      } catch (error) {
        this.log(`- ${file} ${error}`)
      }
    })

    await Promise.all(promises)

    // Write the JSON payload to file
    fs.writeFileSync(
      path.join(directoryPath, 'versioning.json'),
      JSON.stringify(jsonObject),
    )
  }

  async generateSourceInfo(sourceId: string, directoryPath: string) {
    // Files starting with . should be ignored (hidden) - Also ignore the tests directory
    if (sourceId.startsWith('.') || sourceId.startsWith('tests')) {
      return
    }

    // If its a directory
    if (!fs.statSync(path.join(directoryPath, sourceId)).isDirectory()) {
      this.log('not a Directory, skipping ' + sourceId)
      return
    }

    const finalPath = path.join(directoryPath, sourceId, 'index.js')
    const legacyFinalPath = path.join(directoryPath, sourceId, 'source.js')

    return new Promise<any>((res, rej) => {
      fs.appendFileSync(finalPath, '\nmodule.exports = source;', 'utf8')

      // 0.8
      // remove the last matching '();' efficiently
      const data = fs.readFileSync(legacyFinalPath, 'utf8')
      const lastIndex = data.lastIndexOf('})();')
      fs.writeFileSync(legacyFinalPath, data.substring(0, lastIndex), 'utf8')
      // reattach }); to the end of the file
      fs.appendFileSync(legacyFinalPath, `});
/* compatibility 'layer' for browserify transition, by the way I hate this, the behavior of paperback changed throuhgout 0.8.6 to 0.8.7, to the point where I had to implement this dumb thing. */
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = source()
} else if (typeof define === 'function' && define.amd) {
  define([], source)
} else {
  var g; if (typeof window !== 'undefined') {
    g = window
  } else if (typeof global !== 'undefined') {
    g = global
  } else if (typeof self !== 'undefined') {
    g = self
  } else {
    g = this
  }
  g.Sources = source();
}
`,
      'utf8')

      const req = require(finalPath)

      const classInstance = req[`${sourceId}Info`]

      // make sure the icon is present in the includes folder.
      if (!fs.existsSync(path.join(directoryPath, sourceId, 'includes', classInstance.icon))) {
        rej(new Error('[ERROR] [' + sourceId + '] Icon must be inside the includes folder'))
        return
      }

      res({
        id: sourceId,
        name: classInstance.name,
        author: classInstance.author,
        desc: classInstance.description,
        website: classInstance.authorWebsite,
        contentRating: classInstance.contentRating,
        version: classInstance.version,
        icon: classInstance.icon,
        tags: classInstance.sourceTags,
        websiteBaseURL: classInstance.websiteBaseURL,
        intents: classInstance.intents,
      })
    })
  }

  async bundleSources(folder = '', useTypeChecking = false) {
    const cwd = process.cwd()
    const tmpTranspilePath = path.join(cwd, 'tmp')
    const bundlesDirPath = path.join(cwd, 'bundles', folder)

    const transpileTime = this.time('Transpiling project', Utils.headingFormat)
    this.utils.deleteFolderRecursive(tmpTranspilePath)

    if (useTypeChecking) {
      shelljs.exec('npx tsc --outDir tmp')
    } else {
      shelljs.exec('npx swc src -q --out-dir tmp --source-maps')
      
      // try {
      //   const transpiledCode = await swc.transform(path.join(cwd, 'src'), {
      //     outputPath: tmpTranspilePath,
      //     sourceMaps: true,
      //     jsc: {
      //       target: 'es2020',
      //       parser: {
      //         syntax: 'typescript',
      //         tsx: false,
      //       },
      //     },
      //   })
      // } catch (error) {
      //   this.log('Transpilation failed')
      //   this.log((error as Error).message)
      //   return
      // }
    }

    transpileTime.end()

    this.log()

    const bundleTime = this.time('Bundle time', Utils.headingFormat)
    this.utils.deleteFolderRecursive(bundlesDirPath)
    fs.mkdirSync(bundlesDirPath, { recursive: true })

    const promises: Promise<void>[] = fs.readdirSync(tmpTranspilePath).map(async file => {
      const fileBundleTime = this.time(`- Building ${file}`)

      this.utils.copyFolderRecursive(
        path.join(cwd, 'src', file, 'external'),
        path.join(tmpTranspilePath, file),
      )

      await this.altbundle(file, tmpTranspilePath, bundlesDirPath)

      this.utils.copyFolderRecursive(
        path.join(cwd, 'src', file, 'includes'),
        path.join(bundlesDirPath, file),
      )

      fileBundleTime.end()
    })

    await Promise.all(promises)

    bundleTime.end()

    this.log()
    // Remove the build folder
    this.utils.deleteFolderRecursive(path.join(cwd, 'tmp'))
  }

  async bundle(file: string, sourceDir: string, destDir: string): Promise<void> {
    if (file === 'tests') {
      this.log('Tests directory, skipping')
      return
    }

    // If its a directory
    if (!fs.statSync(path.join(sourceDir, file)).isDirectory()) {
      this.log('Not a directory, skipping ' + file)
      return
    }

    const filePath = path.join(sourceDir, file, `/${file}.js`)

    if (!fs.existsSync(filePath)) {
      this.log("The file doesn't exist, skipping. " + file)
      return
    }

    const outputPath = path.join(destDir, file)
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }

    await Promise.all([
      // For 0.9 and above
      // new Promise<void>(res => {
      // browserify([filePath], {standalone: 'Sources'})
      // .external(['axios', 'fs'])
      // .bundle()
      // .pipe(
      //   fs.createWriteStream(path.join(outputPath, 'index.js')).on('finish', () => {
      //     res()
      //   }),
      // )
      // }),
      // use esbuild instead
      esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        platform: 'node',
        target: 'es2019', // Change the target to 'es2019' for ES modules
        format: 'esm', // Change the format to 'esm' for ES modules
        outfile: path.join(outputPath, 'index.js'),
        external: ['axios', 'fs'],
        globalName: 'source',
      }),

      // For 0.8; ensures backwards compatibility with 0.7 sources
      // new Promise<void>(res => {
      //   browserify([filePath], {standalone: 'Sources'})
      //   .external(['axios', 'fs'])
      //   .bundle()
      //   .pipe(
      //     fs.createWriteStream(path.join(outputPath, 'source.js')).on('finish', () => {
      //       res()
      //     }),
      //   )
      // }),
      esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        platform: 'node',
        target: 'es2019', // Change the target to 'es2019' for ES modules
        format: 'esm', // Change the format to 'esm' for ES modules
        outfile: path.join(outputPath, 'source.js'),
        external: ['axios', 'fs'],
        globalName: 'source',
      }),
    ])
  }

  async altbundle(fileName: string, sourceDir: string, destDir: string): Promise<void> {
    if (fileName === 'tests') {
      this.log('Tests directory, skipping')
      return
    }

    // If its a directory
    if (!fs.statSync(path.join(sourceDir, fileName)).isDirectory()) {
      this.log('Not a directory, skipping ' + fileName)
      return
    }

    const absoluteFilePath = path.join(sourceDir, fileName, `/${fileName}.js`)

    if (!fs.existsSync(absoluteFilePath)) {
      this.log("The file doesn't exist, skipping. " + fileName)
      return
    }

    const absoluteOutputPath = path.join(destDir, fileName)
    if (!fs.existsSync(absoluteOutputPath)) {
      fs.mkdirSync(absoluteOutputPath)
    }

    const bundleResults = await Promise.all([
      // For 0.9 and above
      // new Promise<void>(res => {
      // browserify([filePath], {standalone: 'Sources'})
      // .external(['axios', 'fs'])
      // .bundle()
      // .pipe(
      //   fs.createWriteStream(path.join(outputPath, 'index.js')).on('finish', () => {
      //     res()
      //   }),
      // )
      // }),
      // use esbuild instead
      esbuild.build({
        entryPoints: [absoluteFilePath],
        bundle: true,
        platform: 'browser',
        target: 'es2020', // Change the target to 'es2019' for ES modules
        format: 'iife', // Change the format to 'esm' for ES modules
        outfile: path.join(absoluteOutputPath, 'index.js'),
        external: ['axios', 'fs'],
        globalName: 'source',
        metafile: true,
      }),

      // The following doesn't work
      // swc.bundle({
      //   workingDir: process.cwd(),
      //   entry: absoluteFilePath,
      //   options: {
      //     sourceMaps: true,
      //     swcrc: false,
      //     isModule: true,
      //     module: {
      //       type: 'commonjs',
      //       strict: true,
      //     },
      //     jsc: {
      //       baseUrl: sourceDir,
      //       paths: {
      //         '@paperback': [path.join(process.cwd(), 'node_modules', '@paperback')],
      //       },
      //       parser: {
      //         syntax: 'typescript',
      //         tsx: false,
      //       },
      //       target: 'es2020',
      //       keepClassNames: true,
      //     },
      //   },
      //   module: {
      //     type: 'commonjs',
      //     strict: true,
      //   },
      //   output: {
      //     name: 'index.js',
      //     path: absoluteOutputPath,
      //   },
      //   target: 'node',
      //   mode: 'production',
      // } as BundleInput),

      // For 0.8; ensures backwards compatibility with 0.7 sources
      // new Promise<void>(res => {
      //   browserify([filePath], {standalone: 'Sources'})
      //   .external(['axios', 'fs'])
      //   .bundle()
      //   .pipe(
      //     fs.createWriteStream(path.join(outputPath, 'source.js')).on('finish', () => {
      //       res()
      //     }),
      //   )
      // }),
      esbuild.build({
        entryPoints: [absoluteFilePath],
        bundle: true,
        platform: 'browser',
        target: 'es2020', // Change the target to 'es2019' for ES modules
        format: 'iife', // Change the format to 'esm' for ES modules
        outfile: path.join(absoluteOutputPath, 'source.js'),
        external: ['axios', 'fs'],
        globalName: 'source',
        metafile: true,
      }),

      // The following doesn't work
      // swc.bundle({
      //   workingDir: process.cwd(),
      //   entry: absoluteFilePath,
      //   options: {
      //     sourceMaps: true,
      //     swcrc: false,
      //     isModule: true,
      //     module: {
      //       type: 'commonjs',
      //       strict: true,
      //     },
      //     jsc: {
      //       baseUrl: sourceDir,
      //       paths: {
      //         '@paperback': [path.join(process.cwd(), 'node_modules', '@paperback')],
      //       },
      //       parser: {
      //         syntax: 'typescript',
      //         tsx: false,
      //       },
      //       target: 'es2020',
      //       keepClassNames: true,
      //     },
      //   },
      //   module: {
      //     type: 'commonjs',
      //     strict: true,
      //   },
      //   output: {
      //     name: 'source.js',
      //     path: absoluteOutputPath,
      //   },
      //   target: 'node',
      //   mode: 'production',
      // } as BundleInput),
    ])

    let c = 0
    bundleResults.forEach(result => {
      fs.writeFileSync(path.join(absoluteOutputPath, `meta${c == 0 ? '-index' : '-source'}.json`), JSON.stringify(result.metafile))
      c++
    })
  }

  async generateHomepage(folder = '') {
    /*
     * Generate a homepage for the repository based on the package.json file and the generated versioning.json
     *
     * Following fields must be registered in package.json:
     * {
     *    repositoryName: "The repository name"
     *    description: "The repository description"
     * }
     * The following fields can be used:
     * {
     *    noAddToPaperbackButton: A boolean used to not generate the AddToPaperback button
     *    repositoryLogo: "Custom logo path or URL"
     *    baseURL: "Custom base URL for the repository"
     * }
     * The default baseURL will be deducted form GITHUB_REPOSITORY environment variable.
     *
     * See website-generation/homepage.pug file for more information on the generated homepage
     */

    // joining path of directory
    const basePath = process.cwd()
    const directoryPath = path.join(basePath, 'bundles', folder)
    const packageFilePath = path.join(basePath, 'package.json')
    // homepage.pug file is added to the package during the prepack process
    const pugFilePath = path.join(__dirname, '../website-generation/homepage.pug')
    const versioningFilePath = path.join(directoryPath, 'versioning.json')

    // The homepage should only be generated if a package.json file exist at the root of the repo
    if (fs.existsSync(packageFilePath)) {
      this.log('- Generating the repository homepage')

      // We need data from package.json and versioning.json created previously
      const packageData = JSON.parse(fs.readFileSync(packageFilePath, 'utf8'))
      const extensionsData = JSON.parse(fs.readFileSync(versioningFilePath, 'utf8'))

      // Creation of the list of available extensions
      // [{name: sourceName, tags[]: []}]
      const extensionList: { name: any; tags: any }[] = []

      for (const extension of extensionsData.sources) {
        extensionList.push(
          {
            name: extension.name,
            tags: extension.tags,
          },
        )
      }

      // To be used by homepage.pug file, repositoryData must by of the format:
      /*
        {
          repositoryName: "",
          repositoryDescription: "",
          baseURL: "https://yourlinkhere",
          sources: [{name: sourceName, tags[]: []}]

          repositoryLogo: "url",
          noAddToPaperbackButton: true,
        }
      */
      const repositoryData: { [id: string]: unknown } = {}

      repositoryData.repositoryName = packageData.repositoryName
      repositoryData.repositoryDescription = packageData.description
      repositoryData.sources = extensionList

      // The repository can register a custom base URL. If not, this file will try to deduct one from GITHUB_REPOSITORY
      if (packageData.baseURL === undefined) {
        const githubRepoEnvVar = process.env.GITHUB_REPOSITORY
        if (githubRepoEnvVar === undefined) {
          // If it's not possible to determine the baseURL, using noAddToPaperbackButton will mask the field from the homepage
          // The repository can force noAddToPaperbackButton to false by adding the field to package.json
          this.log('Both GITHUB_REPOSITORY and baseURL are not defined, setting noAddToPaperbackButton to true')
          repositoryData.baseURL = 'undefined'
          repositoryData.noAddToPaperbackButton = true
        } else {
          const split = githubRepoEnvVar.toLowerCase().split('/')
          // The capitalization of folder is important, using folder.toLowerCase() make a non working link
          this.log(`Using base URL deducted from GITHUB_REPOSITORY environment variable: https://${split[0]}.github.io/${split[1]}${(folder === '') ? '' : '/' + folder}`)
          repositoryData.baseURL = `https://${split[0]}.github.io/${split[1]}${(folder === '') ? '' : '/' + folder}`
        }
      } else {
        this.log(`Using custom baseURL: ${packageData.baseURL}`)
        repositoryData.baseURL = packageData.baseURL
      }

      if (packageData.noAddToPaperbackButton !== undefined) {
        this.log('Using noAddToPaperbackButton parameter')
        repositoryData.noAddToPaperbackButton = packageData.noAddToPaperbackButton
      }

      if (packageData.repositoryLogo !== undefined) {
        this.log('Using repositoryLogo parameter')
        repositoryData.repositoryLogo = packageData.repositoryLogo
      }

      // Compilation of the pug file which is available in website-generation folder
      const htmlCode = pug.compileFile(pugFilePath)(
        repositoryData,
      )

      fs.writeFileSync(
        path.join(directoryPath, 'index.html'),
        htmlCode,
      )
    }
  }
}
