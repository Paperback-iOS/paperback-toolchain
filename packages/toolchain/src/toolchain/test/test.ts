import path from "node:path"
import vm from 'node:vm'
import fs from 'node:fs'
import pc from 'picocolors'
import { ApplicationPolyfill } from '@paperback/runtime-polyfills'

export async function runSourceTests(bundlesDirectory: string, sourceId: string) {
  const sourceDirectory = path.join(bundlesDirectory, sourceId)
  const testFilePath = path.join(sourceDirectory, 'test.js')

  const vmContext = vm.createContext({
    Application: ApplicationPolyfill(),
    console, EventTarget, Event, Buffer
  })

  // Add main file
  vm.runInContext(
    fs.readFileSync(testFilePath, 'utf-8'), //
    vmContext
  )

  await vm.runInContext(`source.runTests()`, vmContext)
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

  const defaultTestFile = `
  import { TestSuite, registerDefaultTests } from './suite.js'
  import { ${sourceId} } from '../${sourceId}/main.js'
  import sourceInfo from '../${sourceId}/pbconfig.js'
  
  export async function runTests() {
    const suite = new TestSuite('${sourceId} tests')
    registerDefaultTests(suite, ${sourceId}, sourceInfo)
    
    await suite.run()
  }`

  const testFilePath = path.join(testsDirectory, `${sourceId}.ts`)
  fs.writeFileSync(testFilePath, defaultTestFile)
}