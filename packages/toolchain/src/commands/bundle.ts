import {Flags} from '@oclif/core'
import {CLICommand} from '../command'
import * as path from 'node:path'
import {promises as fs} from 'node:fs'
import {constants} from 'node:fs/promises'

import * as esbuild from 'esbuild'
import Utils from '../utils'

const workingPath = process.cwd()
// eslint-disable-next-line unicorn/prefer-module
const cliInfo = require('../../package.json')
// Homepage generation requirement
// eslint-disable-next-line unicorn/prefer-module
const pug = require('pug')

// eslint-disable-next-line unicorn/prefer-module
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin')
// eslint-disable-next-line unicorn/prefer-module
const stdLibBrowser = require('node-stdlib-browser')
// eslint-disable-next-line unicorn/prefer-module
const nodeSTDLibESBuildShimPath = require.resolve('node-stdlib-browser/helpers/esbuild/shim')

export default class Bundle extends CLICommand {
  static override description =
    'Builds all the sources in the repository and generates a versioning file';

  static override flags = {
    help: Flags.help({char: 'h'}),
    folder: Flags.string({description: 'Subfolder to output to', required: false}),
    'use-node-fs': Flags.boolean({description: 'For more info, check https://github.com/Paperback-iOS/paperback-toolchain/pull/4#issuecomment-1791566399', required: false}),
  };

  fsUtils: Utils = undefined as any
  // eslint-disable-next-line unicorn/prefer-module
  commonsInfo = require(path.join(workingPath, 'node_modules/@paperback/types/package.json'))

  async run() {
    const {flags} = await this.parse(Bundle)

    this.fsUtils = flags['use-node-fs'] ? new Utils(false) : new Utils(true)

    this.log(`Working directory: ${workingPath}`)
    this.log()

    const execTime = this.time('Execution time', Utils.headingFormat)
    await this.bundleSources(flags.folder)

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
    const directoryPath = path.join(workingPath, 'bundles', folder)

    const jsonObject = {
      buildTime: new Date(),
      sources: [] as any[],
      builtWith: {
        toolchain: cliInfo.version,
        types: this.commonsInfo.version,
      },
    }

    const promises = (await fs.readdir(directoryPath)).map(async file => {
      if (file.startsWith('.') || file.startsWith('tests')) return

      const sourceInfo = await this.generateSourceInfo(file, directoryPath).catch(error => {
        this.log(`- ${file} ${error}`)
      })
      jsonObject.sources.push(sourceInfo)
    })

    await Promise.all(promises)

    // Write the JSON payload to file
    await fs.writeFile(
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
    if (!(await fs.stat(path.join(directoryPath, sourceId))).isDirectory()) {
      this.log('not a Directory, skipping ' + sourceId)
      return
    }

    const finalPath = path.join(directoryPath, sourceId, 'source.js')

    return new Promise<any>((res, rej) => {
      // eslint-disable-next-line unicorn/prefer-module
      const req = require(finalPath)

      // eslint-disable-next-line dot-notation
      const classInstance = req['Sources'][`${sourceId}Info`]

      // make sure the icon is present in the includes folder.
      fs.access(path.join(directoryPath, sourceId, 'includes', classInstance.icon), constants.F_OK).then(() => {
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
      }).catch(() => {
        rej(new Error('[ERROR] [' + sourceId + '] Icon must be inside the includes folder'))
      })
    })
  }

  async findSourceEntryPoints(srcFolder?: string) {
    let srcFolderActual = srcFolder ?? ''
    if (srcFolder === undefined || !srcFolder || srcFolderActual === '') {
      srcFolderActual = path.join(workingPath, 'src')
    }

    let files: string[] = []
    try {
      files = await fs.readdir(srcFolderActual)
    } catch (error) {
      console.error(`Error reading directory: ${srcFolderActual}, are you sure you are in the right folder?`, error)

      return []
    }

    const validFiles: string[] = []
    const validFilesPromises = files.map(sourceFolder => {
      const fullFilePath = path.join(srcFolderActual, sourceFolder)
      return fs.stat(fullFilePath)
      .then(stats => {
        if (stats.isDirectory()) {
          return fs.access(path.join(fullFilePath, sourceFolder + '.ts'), constants.F_OK).then(() => {
            validFiles.push(sourceFolder)
          })
        }
      })
      .then()
    })
    await Promise.all(validFilesPromises)

    return validFiles.map(sourceFolder => {
      return {
        in: path.join(srcFolderActual, sourceFolder, sourceFolder + '.ts'),
        out: path.join(sourceFolder, 'source'),
      }
    })
  }

  async bundleSources(folder = '') {
    const bundlesPath = path.join(workingPath, 'bundles', folder)

    await this.fsUtils.deleteFolderRecursive(bundlesPath)

    await fs.mkdir(bundlesPath)

    const bundleTime = this.time('Transpile and bundle time', Utils.headingFormat)

    const entryPoints = await this.findSourceEntryPoints(path.join(workingPath, 'src'))
    const includesPromises = entryPoints.map(entryPoint => {
      return fs.mkdir(path.join(bundlesPath, path.basename(path.dirname(entryPoint.in)), 'includes'), {recursive: true}).catch(error => {
        console.error(`Error creating includes directory in bundles folder for '${entryPoint.in}'`, error)
      })
    })
    // Do wait for all includes to be created before starting the build, as they also instantiate each source's bundles folder.
    await Promise.all(includesPromises)

    // Currently only does shallow copies. However, this should not be a problem as there has not been a case where a source uses nested files inside the includes folder.
    const includesCopyPromises = entryPoints.map(entryPoint => {
      return fs.readdir(path.join(path.dirname(entryPoint.in), 'includes')).then(files => {
        return Promise.all(files.map(file => {
          return fs.copyFile(path.join(path.dirname(entryPoint.in), 'includes', file), path.join(bundlesPath, path.basename(path.dirname(entryPoint.in)), 'includes', file)).catch(error => {
            console.error(`Error copying file '${file}' from includes folder to bundles folder for '${entryPoint.in}'`, error)
          })
        }),
        )
      }).catch(error => {
        console.error(`Error reading includes folder for '${entryPoint.in}'`, error)
      })
    })
    await Promise.all(includesCopyPromises)
    await esbuild.build({
      entryPoints: entryPoints,
      mainFields: ['main', 'module', 'browser'],
      globalName: '_Sources',
      bundle: true,
      minify: true,
      format: 'iife',
      outdir: bundlesPath,
      external: ['axios', 'fs'],
      footer: {
        js: 'this.Sources = _Sources; if (typeof exports === \'object\' && typeof module !== \'undefined\') {module.exports.Sources = this.Sources;} if (typeof globalThis === \'object\') { globalThis.Sources = this.Sources;}',
      },
      inject: [nodeSTDLibESBuildShimPath],
      define: {
        Buffer: 'Buffer',
        process: 'process',
        global: 'global',
      },
      plugins: [plugin(stdLibBrowser)],
    })

    bundleTime.end()

    this.log()
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
    const directoryPath = path.join(workingPath, 'bundles', folder)
    const packageFilePath = path.join(workingPath, 'package.json')
    // homepage.pug file is added to the package during the prepack process
    // eslint-disable-next-line unicorn/prefer-module
    const pugFilePath = path.join(__dirname, '../website-generation/homepage.pug')
    const versioningFilePath = path.join(directoryPath, 'versioning.json')

    // The homepage should only be generated if a package.json file exist at the root of the repo
    try {
      await fs.access(packageFilePath, constants.F_OK)
      this.log('- Generating the repository homepage')

      // We need data from package.json and versioning.json created previously
      const packageData = JSON.parse(await fs.readFile(packageFilePath, 'utf8'))
      const extensionsData = JSON.parse(await fs.readFile(versioningFilePath, 'utf8'))

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

      await fs.writeFile(
        path.join(directoryPath, 'index.html'),
        htmlCode,
      )
    } catch (error) {
      console.group('Unexpected error', error)
    }
  }
}
