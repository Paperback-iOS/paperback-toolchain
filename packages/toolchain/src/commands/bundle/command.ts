import { buildCommand } from '@stricli/core'
import { bundle } from './index.js'

export default buildCommand({
  func: bundle,
  parameters: {
    flags: {
      debug: { brief: 'include source maps', kind: 'boolean' },
      tests: { brief: 'include tests', kind: 'boolean' },
      folder: {
        brief: 'output into a specific folder',
        kind: 'parsed',
        parse: String,
        optional: true,
      },
    },
    positional: {
      kind: 'tuple',
      parameters: [],
    },
  },
  docs: {
    brief: 'bundle paperback extensions into a repository',
  },
})
