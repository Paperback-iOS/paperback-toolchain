import {Command} from '@oclif/core'
import Utils from './utils'

export abstract class CLICommand extends Command {
  override log(message = '') {
    for (const line of message.split('\n')) {
      Utils.log(line)
    }
  }

  time(label: string, format?: string | undefined) {
    return Utils.time(label, format)
  }

  async measure(label: string, format: string, closure: () => Promise<void>) {
    const time = Utils.time(label, format)
    await closure()
    time.end()
  }
}
