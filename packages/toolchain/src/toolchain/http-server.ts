import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import os from 'node:os'
import pc from 'picocolors'

function getLocalIPv4Address(): string[] {
  const ips: string[] = []
  const interfaces = os.networkInterfaces()

  Object.keys(interfaces).forEach((_interface) => {
    const devs = interfaces[_interface] ?? []

    devs.forEach((dev) => {
      if (dev.family === 'IPv4' && !dev.internal) {
        ips.push(dev.address)
      }
    })
  })

  return ips
}

export function startServer(port: number) {
  const server = http
      .createServer((request, response) => {
        console.log(`${request.method} Request ${request.url}`)

        if (request.method === 'OPTIONS') {
          response.end()
          return
        }

        let filePath = './bundles' + request.url
        if (request.url === '/') {
          filePath += 'index.html'
        }

        const extname = String(path.extname(filePath)).toLowerCase()
        const mimeTypes: Record<string, string> = {
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
          '.woff': 'application/font-woff',
        }

        const contentType = mimeTypes[extname] || 'application/octet-stream'

        fs.readFile(filePath, (error, content) => {
          if (error != null) {
            if (error.code === 'ENOENT') {
              response.writeHead(404)
              response.end('Page not found: ' + error.code + ' ..\n')
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
              'Content-Type': contentType,
              'access-control-allow-origin': '*',
            })
            response.end(content, 'utf8')
          }
        })
      })
      .listen(port)

    console.log(
      `Server running at ${pc.green(`http://127.0.0.1:${port}/`)}`
    )
    
    for (const ip of getLocalIPv4Address()) {
      console.log(`Server running at ${pc.green(`http://${ip}:${port}/`)}`)
    }

    return server
}