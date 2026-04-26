import pc from 'picocolors'
import path from 'node:path';
import fs from 'node:fs';
import { bundle, type BundleFlags } from '../bundle/index.js';
import { runSourceTests, generateDefaultTests } from '../../toolchain/test/test.js';
import type { LocalContext } from '../../context.js';
import type { ExtensionInfo } from '@paperback/types'
import { Listr, TestRenderer, color, delay } from 'listr2';
import esbuild from 'esbuild'
import { Logger } from '../../toolchain/test/logger.js';
import { log } from 'node:console';
import { fail } from 'node:assert';

interface TestFlags {
  generate: boolean
  overwrite: boolean
  output?: string
  console: boolean
}

const bundleFlags: BundleFlags = {
  debug: true,
  tests: true
}

export async function test(this: LocalContext, flags: TestFlags, sourceId?: string) {
  const cwd = this.process.cwd()
  console.clear()

  const testOutputDirectory = path.join(cwd, 'bundles', 'tests')
  if (fs.existsSync(testOutputDirectory)) {
    fs.rmSync(testOutputDirectory, { recursive: true, force: true })
  }

  const srcDirectory = path.join(cwd, 'src');
  const testsDirectory = path.join(srcDirectory, 'tests');
  if (flags.generate) {
    console.log(pc.underline(pc.blue('Generating Tests')));
  }

  const sourcesToTest = sourceId ? [sourceId] : fs.readdirSync(srcDirectory)
  const filesToBundle: { in: string, out: string }[] = []
  for (const sourceId of sourcesToTest) {
    if (sourceId === 'tests' || sourceId.startsWith('.')) continue;

    const hasPBConfig = fs.existsSync(path.join(srcDirectory, sourceId, 'pbconfig.ts'));
    if (!hasPBConfig) continue;

    const testFilePath = path.join(testsDirectory, `${sourceId}.ts`)
    let hasTestFile = fs.existsSync(testFilePath);
    if (flags.generate) {
      if (!hasTestFile || flags.overwrite) {
        generateDefaultTests(sourceId, testsDirectory);
        console.log(`  ${pc.yellow(sourceId)}: ${pc.green('generated')}`);

        hasTestFile = true
      } else {
        console.log(`  ${pc.yellow(sourceId)}: ${pc.dim('skipping')}`);
      }
    }

    if (!hasTestFile) continue
    filesToBundle.push({ in: testFilePath, out: sourceId })
  }

  if (flags.generate) {
    console.log();
  }

  console.log(pc.underline(pc.blue('Building Tests')))
  const buildStartTime = process.hrtime.bigint();
  await esbuild.build({
    bundle: true,
    entryPoints: filesToBundle,
    format: 'iife',
    target: 'ES2020',
    globalName: 'source',
    outdir: testOutputDirectory,
    minify: false,
    absWorkingDir: cwd,
    sourcemap: 'linked',
  })
  const buildEndTime = process.hrtime.bigint();
  console.log(`  Finished in`, pc.dim(`${Number(buildEndTime - buildStartTime) / 1e6}ms`));

  console.log('\n' + pc.underline(pc.blue('Running Tests')))
  const testStartTime = process.hrtime.bigint();
  const logger = new Logger()
  const promises: Promise<void>[] = []
  for (const { out: extension } of filesToBundle) {
    promises.push(new Promise(async (resolve) => {
      const start = process.hrtime.bigint();
      const extensionLogger = logger.scope(extension)
      try {
        await runSourceTests(
          extensionLogger,
          path.join(testOutputDirectory, `${extension}.js`)
        )
      } catch (error) {
        extensionLogger.log("error", String(error))
      }
      const end = process.hrtime.bigint();

      const data: any = extensionLogger.raw()
      const result = !("error" in data) && data["summary"]?.failed == false ? pc.green("pass") : pc.red("fail")
      console.log(`  ${pc.yellow(extension)}:`, pc.dim(`${Number(end - start) / 1e6}ms`), ` ... ${result}`);
      resolve()
    }))
  }

  await Promise.all(promises)
  const testEndTime = process.hrtime.bigint();

  const logData: any = logger.raw()
  var passedTests = 0
  var failedTests = 0
  let output = ''
  for (const scope in logData) {
    output += `\n------ ${pc.yellow(scope)} ------\n\n`
    if ("tests" in logData[scope]) {
      const tests = logData[scope].tests
      output += `${tests.length} Tests:\n`
      for (const test of tests) {
        const result = test.result == "pass" ? pc.green(test.result) : pc.red(test.result)
        output += `  ${(test.name)}: ${pc.dim(test.duration + "ms")} ... ${result}\n`
        if ("error" in test) {
          output += `    ${test.error}\n`
          failedTests++
        } else {
          passedTests++
        }
      }
    }

    if (flags.console && "console" in logData[scope]) {
      output += "\nConsole:\n"
      output += logData[scope].console.map((o: any) => `    [${o.method}] [${o.time}] ${o.args.join(' ')}`).join("\n") + '\n'
    }
  }

  if (flags.output) {
    fs.writeFileSync(flags.output, JSON.stringify(logData, null, 2))
  }

  console.log(output)
  console.log("\nTest Summary")
  console.log("  Duration:", pc.dim(`${Number(testEndTime - testStartTime) / 1e6}ms`))
  console.log("    Passed:", pc.green(passedTests))
  console.log("    Failed:", pc.red(failedTests))
}