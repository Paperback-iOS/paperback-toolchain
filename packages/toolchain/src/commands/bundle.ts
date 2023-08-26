import { Flags } from "@oclif/core"
import { CLICommand } from "../command"
import * as path from "node:path"
import * as fs from "fs-extra"

import * as esbuild from "esbuild"
import Utils from "../utils"

// Homepage generation requirement
import pug from "pug"

export default class Bundle extends CLICommand {
	static override description =
		"Builds all the sources in the repository and generates a versioning file"

	static override flags = {
		help: Flags.help({ char: "h" }),
		folder: Flags.string({
			description: "Subfolder to output to",
			required: false,
		}),
	}

	async run() {
		const { flags } = await this.parse(Bundle)

		this.log(`Working directory: ${process.cwd()}\n`)

		await this.measure("Execution time", Utils.headingFormat, async () => {
			await this.bundleSources(flags.folder)

			await this.measure("Versioning File", Utils.headingFormat, async () => {
				await this.generateVersioningFile(flags.folder)
			})

			await this.measure(
				"Homepage Generation",
				Utils.headingFormat,
				async () => {
					await this.generateHomepage(flags.folder)
				},
			)
		})
	}

	async generateVersioningFile(folder = "") {
		// joining path of directory
		const basePath = process.cwd()
		const directoryPath = path.join(basePath, "bundles", folder)
		const cliInfo = require("../../package.json")
		const commonsInfo = require(path.join(
			basePath,
			"node_modules/@paperback/types/package.json",
		))

		const jsonObject = {
			buildTime: new Date(),
			sources: [] as any[],
			builtWith: {
				toolchain: cliInfo.version,
				types: commonsInfo.version,
			},
		}

		for (const file of fs.readdirSync(directoryPath)) {
			const infoJsonPath = path.join(directoryPath, file, "info.json")
			const directoryContainsExtensionDefinition = fs.existsSync(infoJsonPath)
			if (!directoryContainsExtensionDefinition) continue

			jsonObject.sources.push(require(infoJsonPath))
		}

		// Write the JSON payload to file
		fs.writeFileSync(
			path.join(directoryPath, "versioning.json"),
			JSON.stringify(jsonObject),
		)
	}

	async generateSourceInfo(
		sourceId: string,
		sourceDirectory: string,
		directoryPath: string,
	) {
		const directoryContainsExtensionDefinition = fs.existsSync(
			path.join(sourceDirectory, "pbconfig.js"),
		)
		if (!directoryContainsExtensionDefinition) return

		const configPath = path.join(sourceDirectory, "pbconfig.js")

		const configBundle = esbuild.buildSync({
			format: "cjs",
			write: false,
			bundle: true,
			entryPoints: [configPath],
		})

		if (configBundle.errors.length > 0) {
			for (const error of configBundle.errors) {
				this.log(`[ERROR] ${error.text}`)
			}

			return
		}

		// eslint-disable-next-line no-eval
		const config = eval(configBundle.outputFiles[0].text).default

		// Write the JSON payload to file
		fs.writeFileSync(
			path.join(directoryPath, "info.json"),
			JSON.stringify(config),
		)
	}

	async bundleSources(folder = "") {
		const cwd = process.cwd()

		const srcDir = path.join(cwd, "src")
		const tmpDir = path.join(cwd, "tmp")
		const bundlesDirPath = path.join(cwd, "bundles", folder)

		await this.measure("Transpiling Project", Utils.headingFormat, async () => {
			await fs.remove(tmpDir)

			const files = Utils.filesInPath(srcDir, (_, filename) =>
				/(\.ts|\.js)x?/gi.test(filename),
			).map((file) => {
				return {
					out: path.join(
						".",
						file.slice(srcDir.length).replace(/(\.ts|\.js)x?$/gi, ""),
					),
					in: file,
				}
			})

			await esbuild.build({
				jsx: "transform",
				jsxFactory: "Paperback.createFormElement",
				entryPoints: files,
				bundle: false,
				outdir: tmpDir,
			})
		})

		await this.measure("Bundle time", Utils.headingFormat, async () => {
			Utils.deleteFolderRecursive(bundlesDirPath)
			fs.mkdirSync(bundlesDirPath, { recursive: true })

			const promises: Promise<void>[] = fs
				.readdirSync(tmpDir)
				.map(async (file) => {
					const sourceDir = path.join(tmpDir, file)
					const bundleDestinationDir = path.join(bundlesDirPath, file)

					await this.measure(`- Building ${file}`, undefined, async () => {
						await fs.copy(
							path.join(srcDir, file, "static"),
							path.join(bundleDestinationDir, "static"),
						)

						await this.bundleExtension(file, sourceDir, bundleDestinationDir)
						await this.generateSourceInfo(file, sourceDir, bundleDestinationDir)
					})
				})

			await Promise.all(promises)
		})

		// Remove the build folder
		Utils.deleteFolderRecursive(path.join(cwd, "tmp"))
	}

	async bundleExtension(
		directoryName: string,
		sourceDirectory: string,
		destinationDirectory: string,
	): Promise<void> {
		const directoryContainsExtensionDefinition = fs.existsSync(
			path.join(sourceDirectory, "pbconfig.js"),
		)
		if (!directoryContainsExtensionDefinition) return

		await esbuild.build({
			entryPoints: [path.join(sourceDirectory, "main.js")],
			outfile: path.join(destinationDirectory, "index.js"),
			bundle: true,
			globalName: "source",
			format: "iife",
		})
	}

	async generateHomepage(folder = "") {
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
		const directoryPath = path.join(basePath, "bundles", folder)
		const packageFilePath = path.join(basePath, "package.json")
		// homepage.pug file is added to the package during the prepack process
		const pugFilePath = path.join(
			__dirname,
			"../website-generation/homepage.pug",
		)
		const versioningFilePath = path.join(directoryPath, "versioning.json")

		// The homepage should only be generated if a package.json file exist at the root of the repo
		if (fs.existsSync(packageFilePath)) {
			this.log("- Generating the repository homepage")

			// We need data from package.json and versioning.json created previously
			const packageData = JSON.parse(fs.readFileSync(packageFilePath, "utf8"))
			const extensionsData = JSON.parse(
				fs.readFileSync(versioningFilePath, "utf8"),
			)

			// Creation of the list of available extensions
			// [{name: sourceName, tags[]: []}]
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			const extensionList = extensionsData.sources.map((extension: any) => ({
				name: extension.name,
				badges: extension.badges,
			}))

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
					this.log(
						"Both GITHUB_REPOSITORY and baseURL are not defined, setting noAddToPaperbackButton to true",
					)
					repositoryData.baseURL = "undefined"
					repositoryData.noAddToPaperbackButton = true
				} else {
					const split = githubRepoEnvVar.toLowerCase().split("/")
					// The capitalization of folder is important, using folder.toLowerCase() make a non working link
					this.log(
						`Using base URL deducted from GITHUB_REPOSITORY environment variable: https://${
							split[0]
						}.github.io/${split[1]}${folder === "" ? "" : `/${folder}`}`,
					)
					repositoryData.baseURL = `https://${split[0]}.github.io/${split[1]}${
						folder === "" ? "" : `/${folder}`
					}`
				}
			} else {
				this.log(`Using custom baseURL: ${packageData.baseURL}`)
				repositoryData.baseURL = packageData.baseURL
			}

			if (packageData.noAddToPaperbackButton !== undefined) {
				this.log("Using noAddToPaperbackButton parameter")
				repositoryData.noAddToPaperbackButton =
					packageData.noAddToPaperbackButton
			}

			if (packageData.repositoryLogo !== undefined) {
				this.log("Using repositoryLogo parameter")
				repositoryData.repositoryLogo = packageData.repositoryLogo
			}

			// Compilation of the pug file which is available in website-generation folder
			const htmlCode = pug.compileFile(pugFilePath)(repositoryData)

			fs.writeFileSync(path.join(directoryPath, "index.html"), htmlCode)
		}
	}
}
