import { MockSelectorRegistry } from './SelectorRegistry.js'
import { decodeHTMLStrict } from 'entities'
import { MockRequestManager } from './RequestManager.js'
import { MockDiscoverSectionManager } from './DiscoverSectionManager.js'
import crypto from 'node:crypto'

// This is a function so that a new object can be requested at any time
// in-case multiple sources are being tested
export function ApplicationPolyfill(): typeof Application {
  let stateStorage: Record<string, unknown> = {}
  const secureStateStorage: Record<string, unknown> = {}
  const selectorRegistry = new MockSelectorRegistry()
  const requestManager = new MockRequestManager(selectorRegistry)
  const discoverSectionManager = new MockDiscoverSectionManager(
    selectorRegistry
  )

  return {
    decodeHTMLEntities: decodeHTMLStrict,

    sleep: function (seconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
      })
    },

    registerDiscoverSection:
      discoverSectionManager.registerDiscoverSection.bind(
        discoverSectionManager
      ),
    unregisterDiscoverSection:
      discoverSectionManager.unregisterDiscoverSection.bind(
        discoverSectionManager
      ),
    registeredDiscoverSections:
      discoverSectionManager.registeredDiscoverSections.bind(
        discoverSectionManager
      ),
    invalidateDiscoverSections:
      discoverSectionManager.invalidateDiscoverSections.bind(
        discoverSectionManager
      ),

    registerInterceptor:
      requestManager.registerInterceptor.bind(requestManager),
    unregisterInterceptor:
      requestManager.unregisterInterceptor.bind(requestManager),
    setRedirectHandler: requestManager.setRedirectHandler.bind(requestManager),
    getDefaultUserAgent:
      requestManager.getDefaultUserAgent.bind(requestManager),
    scheduleRequest: requestManager.scheduleRequest.bind(requestManager),

    arrayBufferToUTF8String: function (arrayBuffer) {
      return new TextDecoder('utf-8').decode(arrayBuffer)
    },
    arrayBufferToASCIIString: function (arrayBuffer) {
      return new TextDecoder('ascii').decode(arrayBuffer)
    },
    arrayBufferToUTF16String: function (arrayBuffer) {
      return new TextDecoder('utf-16').decode(arrayBuffer)
    },
    base64Encode: function (value: string | ArrayBuffer) {
      let rawData

      if (typeof value === 'string') {
        rawData = Buffer.from(value, 'utf8')
      } else if (value instanceof ArrayBuffer) {
        rawData = Buffer.from(value)
      } else {
        throw new Error(
          `Unable to convert input to raw data: ${value} of type ${typeof value} is ArrayBuffer ${(value as any) instanceof ArrayBuffer}`
        )
      }

      const encodedString = rawData.toString('base64')

      if (encodedString === null || encodedString === undefined) {
        return rawData.buffer.slice(
          rawData.byteOffset,
          rawData.byteOffset + rawData.byteLength
        )
      }

      return encodedString
    },

    base64Decode: function (value: string | ArrayBuffer) {
      let decodedData

      if (typeof value === 'string') {
        decodedData = Buffer.from(value, 'base64')
      } else if (value instanceof ArrayBuffer) {
        decodedData = Buffer.from(value)
      } else {
        throw new Error('Unable to convert base64 String to decoded Data')
      }

      const decodedString = decodedData.toString('utf8')
      const reEncoded = Buffer.from(decodedString, 'utf8')

      if (reEncoded.equals(decodedData)) {
        return decodedString
      }

      return decodedData.buffer.slice(
        decodedData.byteOffset,
        decodedData.byteOffset + decodedData.byteLength
      )
    },

    getSecureState: function (key) {
      return secureStateStorage[key]
    },

    setSecureState: function (value, key) {
      secureStateStorage[key] = value
    },

    getState: function (key) {
      return stateStorage[key]
    },

    setState: function (value, key) {
      stateStorage[key] = value
    },

    resetAllState: function () {
      stateStorage = {}
    },

    executeInWebView: function () {
      throw new Error('Not Implemented')
    },

    isResourceLimited: false,
    filterAdultTitles: false,
    filterMatureTitles: false,

    Selector: selectorRegistry.Selector.bind(selectorRegistry),
    SelectorRegistry: selectorRegistry,

    crypto_md5Hash: function (value: string | ArrayBuffer) {
      let data: Uint8Array | string
      if (typeof value === 'string') {
        data = value
      } else {
        data = new Uint8Array(value)
      }
      return crypto.createHash('md5').update(data).digest('hex')
    },
  }
}
