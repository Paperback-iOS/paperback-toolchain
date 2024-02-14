import { Command, Flags, ux } from '@oclif/core'

import Server from '../server'
import Bundle from './bundle'

import chalk from 'chalk'

export default class Serve extends Command {
    static override description = 'Build the sources and start a local server'

    static override flags = {
        help: Flags.help({ char: 'h' }),
        port: Flags.integer({ char: 'p', default: 8080 })
    }

    fixedWidth(number: number, width: number) {
        return (Array.from({ length: width }).join('0') + number).slice(-width)
    }

    async run() {
        const { flags } = await this.parse(Serve)

        console.clear()

        this.log(chalk.blue('Building Sources'))

        // Make sure the repo is bundled
        await Bundle.run([])
        this.log()
        this.log(chalk.underline.blue('Starting Server on port ' + flags.port))

        const server = new Server(flags.port)

        server.start()
        this.log()
        this.log(chalk`For a list of commands do {green h} or {green help}`)

        let stopServer = false
        while (!stopServer) {
            // eslint-disable-next-line no-await-in-loop
            const input = await ux.prompt(this.prefixTime('')).then((x) => x.trim())

            if (input === 'h' || input === 'help') {
                this.log(chalk.underline.bold('Help'))
                this.log('  h, help - Display this message')
                this.log('  s, stop - Stop the server')
                this.log('  r, restart - Restart the server, also rebuilds the sources')
            }

            if (input === 's' || input === 'stop') {
                stopServer = true
            }

            if (input === 'r' || input === 'restart') {
                server.stop()

                console.clear()

                this.log(chalk.underline.blue('Building Sources'))

                // Make sure the repo is bundled
                // eslint-disable-next-line no-await-in-loop
                await Bundle.run([])
                this.log()
                this.log(chalk.underline.blue('Starting Server on port ' + flags.port))

                server.start()
                this.log()
                this.log(chalk`For a list of commands do {green h} or {green help}`)
            }
        }

        // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
        process.exit(0)
    }

    private prefixTime(message = '') {
        const date = new Date()

        const hours = this.fixedWidth(date.getHours(), 2)
        const minutes = this.fixedWidth(date.getMinutes(), 2)
        const seconds = this.fixedWidth(date.getSeconds(), 2)
        const milliseconds = this.fixedWidth(date.getMilliseconds(), 4)
        const time = `${hours}:${minutes}:${seconds}:${milliseconds}`
        return chalk`[{gray ${time}}] ${message}`
    }
}
