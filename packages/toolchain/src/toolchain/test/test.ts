import path from 'node:path'
import vm from 'node:vm'
import fs from 'node:fs'
import pc from 'picocolors'
import { ApplicationPolyfill } from '@paperback/runtime-polyfills'
import type { Logger } from './logger.js'

export async function runSourceTests(logger: Logger, testFilePath: string) {
  const vmContext = vm.createContext({
    Application: ApplicationPolyfill(),
    console: logger.console(),
    logger,
    EventTarget,
    Event,
    Buffer,
    TextEncoder,
    TextDecoder,
    SubtleCrypto,
    crypto
  })

  // Add main file
  vm.runInContext(
    fs.readFileSync(testFilePath, 'utf-8'), //
    vmContext
  )

  await vm.runInContext(`source.runTests(logger)`, vmContext)
}

export function generateDefaultTests(sourceId: string, testsDirectory: string) {
  const defaultSuitePath = path.join(testsDirectory, 'suite.ts')
  const hasDefaultSuite = fs.existsSync(defaultSuitePath)
  if (!hasDefaultSuite) {
    fs.cpSync(
      path.join(import.meta.dirname, './suite.template.ts'),
      path.join(testsDirectory, './suite.ts')
    )
  }

  const testFilePath = path.join(testsDirectory, `${sourceId}.ts`)
  const defaultTestFile = `
  import { type TestLogger } from '@paperback/types'
  import { TestSuite, registerDefaultTests } from './suite.js'
  import { ${sourceId} } from '../${sourceId}/main.js'
  import sourceInfo from '../${sourceId}/pbconfig.js'
  
  export async function runTests(logger: TestLogger) {
    const suite = new TestSuite('${sourceId} tests', logger)
    registerDefaultTests(suite, ${sourceId}, sourceInfo)
    
    await suite.run()
  }`

  fs.writeFileSync(testFilePath, defaultTestFile)
}
