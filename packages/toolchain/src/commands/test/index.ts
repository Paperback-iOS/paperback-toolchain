import pc from 'picocolors'
import path from 'node:path';
import fs from 'node:fs';
import { bundle, type BundleFlags } from '../bundle/index.js';
import { runSourceTests, generateDefaultTests } from '../../toolchain/test/test.js';
import type { LocalContext } from '../../context.js';
import type { ExtensionInfo } from '@paperback/types'
import { Listr, TestRenderer, color, delay } from 'listr2';

interface TestFlags {
  generate: boolean
}

const bundleFlags: BundleFlags = {
  debug: true,
  tests: true
}

export async function test(this: LocalContext, flags: TestFlags, sourceId?: string) {
  const cwd = this.process.cwd()
  console.clear()
  console.log(pc.underline(pc.blue('Testing')))

  const listr = new Listr([], {
    rendererOptions: {
      // persistentOutput: true,
      // clearOutput: false,
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
        format: () => color.dim,
      },
    },
  })

  if (flags.generate) {
    const srcDirectory = path.join(cwd, 'src')
    const generateTestsListr = new Listr([], { concurrent: false })

    if (sourceId) {
      generateTestsListr.add({
        title: sourceId,
          task: (_, task) => generateDefaultTests(sourceId, path.join(srcDirectory, 'tests')),
          rendererOptions: { outputBar: Infinity, persistentOutput: true },
      })
    } else {
      for (const dirname of fs.readdirSync(srcDirectory)) {
        if (dirname === 'tests' || dirname.startsWith('.')) continue
        const hasPBConfig = fs.existsSync(path.join(srcDirectory, dirname, 'pbconfig.ts'))
        if (!hasPBConfig) continue
        generateTestsListr.add({
          title: dirname,
          task: (_, task) => generateDefaultTests(dirname, path.join(srcDirectory, 'tests')),
          rendererOptions: { outputBar: Infinity, persistentOutput: true },
        })
      }
    }

    listr.add({
      title: "Generate Tests",
      task: () => generateTestsListr,
    })
  }

  listr.add({
    title: "Build Sources",
    task: async () => await bundle.bind(this)(bundleFlags),
  })

  await listr.run()

  console.log('\n'+pc.underline(pc.blue('Running Tests')))
  const bundlesDir = path.join(cwd, 'bundles')
  if (sourceId) {
    await runSourceTests(bundlesDir, sourceId)
  } else {
    const versioningJson: { sources: (ExtensionInfo & { id: string })[] } =
      JSON.parse(
        fs.readFileSync(path.join(bundlesDir, 'versioning.json'), 'utf-8')
      )
    for (const source of versioningJson.sources) {
      const sourceId = source.id
      await runSourceTests(bundlesDir, sourceId)
    }
  }
}