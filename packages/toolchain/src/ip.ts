import * as os from 'node:os'

/**
 * Finds the first non-internal IPv4 address of the current machine.
 * @returns {string} The IPv4 address or '0.0.0.0' if no public address is found.
 */
function getLocalIPv4Address(): string[] {
  let ips: string[] = []
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

export { getLocalIPv4Address }
