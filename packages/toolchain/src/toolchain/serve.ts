import pc from 'picocolors'
import fs from 'node:fs'

export function startFileWatcher(
  directory: string,
  onchange: (filename: string) => void
) {
  try {
    // Watch the entire src directory recursively
    return fs.watch(directory, { recursive: true }, (eventType, filename) => {
      if (!filename) return

      // Skip non-source files
      if (
        !filename.endsWith('.ts') &&
        !filename.endsWith('.js') &&
        !filename.endsWith('.json') &&
        !filename.endsWith('.css') &&
        !filename.endsWith('.html') &&
        !filename.endsWith('.png') &&
        !filename.endsWith('.jpg') &&
        !filename.endsWith('.svg')
      ) {
        return
      }

      onchange(filename)
    })
  } catch (error) {
    console.log(pc.red(`Failed to watch directory ${directory}: ${error}`))
  }
}

export function prefixTime(message = '') {
  const date = new Date()

  const hours = fixedWidth(date.getHours(), 2)
  const minutes = fixedWidth(date.getMinutes(), 2)
  const seconds = fixedWidth(date.getSeconds(), 2)
  const milliseconds = fixedWidth(date.getMilliseconds(), 4)
  const time = `${hours}:${minutes}:${seconds}:${milliseconds}`
  return `[${pc.gray(time)}] ${message}`
}

export function clearConsole() {
  // Clear the console
  process.stdout.write('\x1bc\x1b[3J')
}

export function fixedWidth(number: number, width: number) {
  return (Array.from({ length: width }).join('0') + number).slice(-width)
}
