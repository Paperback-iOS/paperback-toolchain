/* eslint-disable no-await-in-loop */

import {Flags} from '@oclif/core'
import {CLICommand} from '../command'
import Bundle from './bundle'
import * as path from 'node:path'
import * as fs from 'node:fs'
import chalk from 'chalk'
import {ISourceTester, OnDeviceSourceTester, SourceTester} from '../source-tester'
import {SourceTestRequest, TestData, SourceTestResponse} from '../devtools/generated/typescript/PDTSourceTester'
import shelljs from 'shelljs'
import Utils from '../utils'
import Server from '../server'
import {PaperbackSourceTesterClient} from '../devtools/generated/typescript/PDTSourceTester.grpc-client'
import {credentials} from '@grpc/grpc-js'
import ip from 'ip'

export default class Test extends CLICommand {
  static override description = 'describe the command here'

  static override flags = {
    ip: Flags.string({name: 'ip', default: undefined}),
    port: Flags.integer({name: 'port', default: 27_015}),
  }

  static override args = [
    {
      name: 'source',
      required: false,
      description: '(optional) The source to test',
      default: undefined,
    },
  ]

  async run() {
    const {flags, args} = await this.parse(Test)

    const cwd = process.cwd()
    const sourceId = args.source
    let sourcesDirPath: string
    let client: ISourceTester
    if (flags.ip) {
      const grpcClient = new PaperbackSourceTesterClient(
        `${flags.ip}:${flags.port}`,
        credentials.createInsecure(),
      )

      sourcesDirPath = path.join(cwd, 'bundles')
      client = new OnDeviceSourceTester(grpcClient)
    } else {
      this.log(`\n${chalk.bold.underline.bgBlue.white('Transpiling Sources')}`)

      sourcesDirPath = path.join(cwd, 'tmp')
      await this.measure('Time', Utils.headingFormat, async () => {
        Utils.deleteFolderRecursive(sourcesDirPath)
        shelljs.exec('npx tsc --outDir tmp')
      })

      client = new SourceTester(sourcesDirPath)
    }

    const sourcesToTest = this.getSourceIdsToTest(sourceId, sourcesDirPath)
    await this.installSources(sourcesToTest, client)
    await this.testSources(sourcesToTest, client)
  }

  private async logSourceTestReponse(response: SourceTestResponse) {
    this.log(`${chalk.red.bold('#')} ${chalk.bold(response.testCase)}: ${chalk.green(response.completeTime + 'ms')}`)

    const failures = response.failures
    for (const failure of failures) {
      this.log(`- ${chalk.white.bgRed('[FAILURE]')} ${failure}`)
    }

    if (failures.length > 0) this.log()
  }

  private getSourceIdsToTest(sourceId: string, bundleDir: string) {
    let sourcesToTest = []
    sourcesToTest = sourceId ? fs.readdirSync(bundleDir).filter(file => {
      return file.toLowerCase() === sourceId.toLowerCase() && fs.statSync(path.join(bundleDir, file)).isDirectory()
    }) : fs.readdirSync(bundleDir).filter(file => fs.statSync(path.join(bundleDir, file)).isDirectory())

    return sourcesToTest
  }

  private async testSources(sources: string[], client: ISourceTester) {
    for (const sourceId of sources) {
      this.log(`\n${chalk.bold.underline.bgBlue.white(`Testing ${sourceId}`)}`)

      const request: SourceTestRequest = {sourceId}

      const dataPath = path.join(process.cwd(), 'src', sourceId, `${sourceId}.test.json`)
      if (fs.existsSync(dataPath)) {
        request.data = JSON.parse(fs.readFileSync(dataPath, {encoding: 'utf8'}))
      }

      await client.testSource(request, this.logSourceTestReponse.bind(this))
    }
  }

  private async installSources(sources: string[], client: ISourceTester) {
    if (!client.installSource) {
      return
    }

    await Bundle.run([])
    const server = new Server(8000)
    server.start()

    // Install the sources that we need to test on the App
    for (const source of sources) {
      this.log(`\n${chalk.bold.underline.bgBlue.white(`Installing ${source}`)}`)

      // Make sure the source is installed on the app
      await client.installSource({sourceId: source, repoBaseUrl: `http://${ip.address()}:${server.port}`})
    }

    server.stop()
  }
}
