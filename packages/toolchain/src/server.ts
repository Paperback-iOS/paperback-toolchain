import * as fs from 'node:fs'
import * as http from 'node:http'
import * as path from 'node:path'

import chalk from 'chalk'

import { getLocalIPv4Address } from './ip'

export default class Server {
    port: number

    server?: http.Server

    constructor(port: number) {
        this.port = port
    }

    start() {
        if (this.server != null) {
            throw new Error('Server already running')
        }

        this.server = http
            .createServer((request, response) => {
                console.log(`Request ${request.url}`)

                let filePath = './bundles' + request.url
                if (filePath === './') {
                    filePath = './index.html'
                }

                const extname = String(path.extname(filePath)).toLowerCase()
                const mimeTypes: any = {
                    '.css': 'text/css',
                    '.eot': 'application/vnd.ms-fontobject',
                    '.gif': 'image/gif',
                    '.html': 'text/html',
                    '.jpg': 'image/jpg',
                    '.js': 'text/javascript',
                    '.json': 'application/json',
                    '.mp4': 'video/mp4',
                    '.otf': 'application/font-otf',
                    '.png': 'image/png',
                    '.svg': 'image/svg+xml',
                    '.ttf': 'application/font-ttf',
                    '.wasm': 'application/wasm',
                    '.wav': 'audio/wav',
                    '.woff': 'application/font-woff'
                }

                const contentType =
                    mimeTypes[extname] || 'application/octet-stream'

                fs.readFile(filePath, (error, content) => {
                    if (error != null) {
                        if (error.code === 'ENOENT') {
                            response.writeHead(404)
                            response.end(
                                'Page not found: ' + error.code + ' ..\n'
                            )
                        } else {
                            response.writeHead(500)
                            response.end(
                                'Sorry, check with the site admin for error: ' +
                                error.code +
                                ' ..\n'
                            )
                        }
                    } else {
                        response.writeHead(200, {
                            'Content-Type': contentType
                        })
                        response.end(content, 'utf8')
                    }
                })
            })
            .listen(this.port)

        console.log(
            `Server running at ${chalk.green(
                `http://127.0.0.1:${this.port}/versioning.json`
            )}`
        )
        console.log(
            `Server running at ${chalk.green(
                `http://${getLocalIPv4Address()}:${this.port}/versioning.json`
            )}`
        )
    }

    stop() {
        if (this.server === undefined) {
            throw new Error('Server not running')
        }

        this.server?.close()
        this.server = undefined
    }
}
