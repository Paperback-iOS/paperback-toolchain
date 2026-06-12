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
      'device-ip': {
        kind: 'parsed',
        parse: String,
        brief:
          'device ip to reinstall extensions on, only applies in watch mode',
        optional: true,
      },
      'device-port': {
        kind: 'parsed',
        parse: numberParser,
        brief:
          'device port to reinstall extensions on, only applies in watch mode',
        default: '27015',
      },
    },
  },
  docs: {
    brief: 'stream logs from a paperback instance',
  },
})
