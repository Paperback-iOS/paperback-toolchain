/* eslint-disable unicorn/prefer-module */
const {exec} = require('node:child_process')
const os = require('node:os')
const fs = require('node:fs')
const path = require('node:path')
const platform = os.platform()

const dirname = __dirname

async function main() {
  await exec('protoc --version', (err, _stdout, _stderr) => {
    if (err) {
      console.error('Error: protoc is not installed. Please install it first.')
    }
  })

  if (platform === 'win32') {
    console.log('Detected Windows.')

    const protobufPath = path.join(dirname, 'protobuf')
    const protobufWildcardPath = path.join(dirname, 'protobuf', '*.proto')

    // TS generation
    const tsGenerationPath = path.join(dirname, 'generated', 'typescript')
    await fs.rmSync(tsGenerationPath, {recursive: true, force: true})
    await fs.mkdirSync(tsGenerationPath)

    console.log('Generating TS Files')
    exec(`npx protoc --ts_out="${tsGenerationPath}" --ts_opt=client_grpc1 --proto_path="${protobufPath}" "${protobufWildcardPath}"`, (err, stdout, _stderr) => {
      if (err) {
        console.error(err)
        return
      }

      console.log(stdout)

      console.log('DONE')
    })
    // Hi, Ivan here, I have tried every conceivable way of producing a working protoc-gen-swift binary for windows, but it just doesn't work. The code is here for it, but it just doesn't work.
    console.log('Skipping Swift Files generation due to incompatiblity with Windows. (See comment in code)')
    // Swift generation
    // const swiftGenerationPath = path.join(dirname, '/generated/swift')
    // await fs.rmSync(swiftGenerationPath, {recursive: true, force: true})
    // await fs.mkdirSync(swiftGenerationPath)

    // console.log('Generating Swift Files')

    // const swiftPluginPath = path.join(dirname, '/plugins/protoc-gen-swift')
    // const swiftgRPCPluginPath = path.join(dirname, '/plugins/protoc-gen-grpc-swift')
    // exec(`npx protoc --plugin="${swiftPluginPath}" --plugin="${swiftgRPCPluginPath}" --swift_opt=Visibility=Public --swift_out="${swiftGenerationPath}" --grpc-swift_opt=Visibility=Public --grpc-swift_out="${swiftGenerationPath}" --proto_path="${protobufPath}" "${protobufWildcardPath}"`, (err, stdout, _stderr) => {
    //   if (err) {
    //     console.error(err)
    //     return
    //   }

    //   console.log(stdout)

    //   console.log('DONE')
    // })
  } else {
    console.warn('Warning: This script is only supported on Windows, Mac and some Linux distros. Bash scripts will be executed as substitute (no Windows detected as OS)')

    exec(`sh ${path.join(dirname, 'generate.sh')}`, (err, stdout, _stderr) => {
      if (err) {
        console.error(err)
        return
      }

      console.log(stdout)
    })
  }
}

main()
