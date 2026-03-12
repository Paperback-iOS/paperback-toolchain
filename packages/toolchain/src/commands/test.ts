import { Args, Command, Flags } from '@oclif/core'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'path'
import Bundle from './bundle.js'
import { type ExtensionInfo } from '@paperback/types'
import vm from 'vm'
import { ApplicationPolyfill } from '@paperback/runtime-polyfills'

export default class Test extends Command {
  static override args = {
    extension: Args.string({
      description: 'The ID for the extension that should be tested',
    }),
  }
  static override description = 'describe the command here'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    testCase: Flags.string({ description: 'test case' }),
    dryRun: Flags.boolean({ description: 'dry run' }),
  }

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(Test)
    const cwd = process.cwd()

    this.clearConsole()

    this.log(pc.blue('Building Sources'))

    // Make sure the repo is bundled
    await Bundle.run(['--debug', '--tests'])

    this.clearConsole()
    this.log()

    const bundlesDir = path.join(cwd, 'bundles')
    if (args.extension) {
      await new SourceTestRunner(bundlesDir, args.extension).runTests()
    } else {
      const versioningJson: { sources: (ExtensionInfo & { id: string })[] } =
        JSON.parse(
          fs.readFileSync(path.join(bundlesDir, 'versioning.json'), 'utf-8')
        )
      for (const source of versioningJson.sources) {
        await new SourceTestRunner(bundlesDir, source.id).runTests()
      }
    }
  }

  private clearConsole() {
    // Clear the console
    process.stdout.write('\x1bc\x1b[3J')
  }
}

class SourceTestRunner {
  constructor(
    private bundlesDirectory: string,
    private sourceId: string
  ) {}

  async runTests() {
    const sourceDirectory = path.join(this.bundlesDirectory, this.sourceId)
    const testFilePath = path.join(sourceDirectory, 'test.js')

    const vmContext = vm.createContext({
      Application: ApplicationPolyfill(),
      console,
    })

    // Add main file
    vm.runInContext(
      fs.readFileSync(testFilePath, 'utf-8'), //
      vmContext
    )

    await vm.runInContext(`source.runTests()`, vmContext)
  }
}
