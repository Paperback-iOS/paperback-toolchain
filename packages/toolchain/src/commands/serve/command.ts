import { buildCommand, numberParser } from '@stricli/core'
import { serve } from './index.js'

export default buildCommand({
  func: serve,
  parameters: {
    flags: {
      port: {
        kind: 'parsed',
        parse: numberParser,
        brief: 'port to start the server on',
        default: '8080',
      },
      watch: { kind: 'boolean', brief: 'rebuild on file change' },
    },
  },
  docs: {
    brief: 'stream logs from a paperback instance',
  },
})
