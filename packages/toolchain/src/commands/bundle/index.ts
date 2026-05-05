import { Listr } from 'listr2'
import {
  bundleSources,
  generateVersioningFile,
  generateHomepage,
} from '../../toolchain/bundle/bundle.js'
import { color } from 'listr2'
import type { LocalContext } from '../../context.js'

export interface BundleFlags {
  debug: boolean
  tests: boolean
  folder?: string
}

export async function bundle(this: LocalContext, flags: BundleFlags) {
  console.log(`Working directory: ${process.cwd()}\n`)

  const tasks = new Listr(
    [
      {
        task: async () =>
          await bundleSources(flags.folder, flags.debug, flags.tests),
        title: 'Bundle Sources',
      },
      {
        task: async () => await generateVersioningFile(flags.folder),
        title: 'Generate Versioning File',
      },
      {
        task: async () => await generateHomepage(flags.folder),
        title: 'Generate Homepage',
      },
    ],
    {
      rendererOptions: {
        clearOutput: false,
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
    }
  )

  await tasks.run()
}
