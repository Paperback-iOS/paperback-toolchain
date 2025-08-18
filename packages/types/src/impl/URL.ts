/**
 * Internal method to parse a URL string and update the current components.
 *
 * @param url - The URL string to parse.
 * @param partial - If true, only update components present in the input.
 */
export function parseURL(url: string): URLComponents {
  const components: URLComponents = {}

  // Regular expression using numbered capture groups.
  // Capture groups:
  //   1: protocol, 2: authority, 3: pathname, 4: query, 5: hash.
  const regex =
    /^(?:([a-zA-Z][a-zA-Z\d+\-.]*):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/
  const match = url.match(regex)
  if (!match) {
    throw new Error('Invalid URL string provided.')
  }

  // Only update a component if the capture group is defined and (for some components) non-empty.
  if (match[1] !== undefined && match[1] !== '') {
    components.protocol = match[1]
  }

  if (match[2] !== undefined && match[2] !== '') {
    // Parse authority into username, password, hostname, and port.
    const authority = match[2]
    let userInfo = ''
    let hostPort = ''
    const atIndex = authority.indexOf('@')
    if (atIndex !== -1) {
      userInfo = authority.substring(0, atIndex)
      hostPort = authority.substring(atIndex + 1)
      if (userInfo !== '') {
        const colonIndex = userInfo.indexOf(':')
        if (colonIndex !== -1) {
          components.username = userInfo.substring(0, colonIndex)
          components.password = userInfo.substring(colonIndex + 1)
        } else {
          components.username = userInfo
          components.password = ''
        }
      }
    } else {
      hostPort = authority
    }

    if (hostPort !== '') {
      if (hostPort.startsWith('[')) {
        const closingBracketIndex = hostPort.indexOf(']')
        if (closingBracketIndex === -1) {
          throw new Error('Invalid IPv6 address in URL update.')
        }
        components.hostname = hostPort.substring(0, closingBracketIndex + 1)
        const portPart = hostPort.substring(closingBracketIndex + 1)
        if (portPart.startsWith(':')) {
          components.port = portPart.substring(1)
        }
      } else {
        const colonIndex = hostPort.lastIndexOf(':')
        if (colonIndex !== -1 && hostPort.indexOf(':') === colonIndex) {
          components.hostname = hostPort.substring(0, colonIndex)
          components.port = hostPort.substring(colonIndex + 1)
        } else {
          components.hostname = hostPort
          components.port = ''
        }
      }
    }
  }

  // Pathname.
  if (match[3] !== undefined && match[3] !== '') {
    components.path = match[3].startsWith('/') ? match[3] : `/${match[3]}`
  }

  // Query.
  if (match[4] !== undefined) {
    const query: Record<string, string | string[]> = {}
    const pairs = match[4].split('&')
    for (const pair of pairs) {
      if (!pair) continue
      const [rawKey, rawValue = ''] = pair.split('=')
      if (rawKey === undefined) continue // Skip if no key found
      const key = decodeURIComponent(rawKey)
      const value = decodeURIComponent(rawValue)
      if (key in query) {
        const existing = query[key]! // Non-null assertion since we know key exists
        if (Array.isArray(existing)) {
          existing.push(value)
        } else {
          query[key] = [existing, value]
        }
      } else {
        query[key] = value
      }
    }
    components.queryItems = query
  }

  // Hash.
  if (match[5] !== undefined) {
    components.fragment = match[5]
  }

  return components
}

/**
 * An interface representing the components of a URL.
 */
export interface URLComponents {
  protocol?: string // e.g., "https:"
  username?: string
  password?: string
  hostname?: string
  port?: string
  path?: string
  queryItems?: Record<string, string | string[]>
  fragment?: string // e.g., "#section"
}

/**
 * A class for parsing, updating, and building URLs.
 *
 * The class does not use the built‑in URL class or named regex capture groups.
 */
export class URL {
  protocol: string
  hostname: string
  path: string

  username?: string
  password?: string
  port?: string
  queryItems?: Record<string, string | string[]> | undefined
  fragment?: string

  /**
   * Creates a new SimpleURL instance.
   * @param url - (Optional) A URL string to initialize the instance.
   */
  constructor(url: string) {
    const components = parseURL(url)

    if (!components.hostname || !components.protocol) {
      throw new Error('URL Hostname and Protocol are required')
    }

    this.hostname = components.hostname
    this.protocol = components.protocol
    this.path = components.path ?? ''
    this.username = components.username
    this.password = components.password
    this.port = components.port
    this.queryItems = components.queryItems
    this.fragment = components.fragment
  }

  /**
   * Returns the full URL string built from the current components.
   */
  toString(): string {
    let url = `${this.protocol}://`

    // Append user info if available.
    if (this.username !== undefined && this.username !== '') {
      url += this.username
      if (this.password !== undefined && this.password !== '') {
        url += `:${this.password}`
      }
      url += '@'
    }

    url += this.hostname

    if (this.port !== undefined && this.port !== '') {
      url += `:${this.port}`
    }

    // Pathname.
    if (this.path !== '') {
      url += this.path.startsWith('/') ? this.path : `/${this.path}`
    }

    if (this.queryItems !== undefined) {
      // Query string.
      const queryKeys = Object.keys(this.queryItems)
      const params: string[] = []
      if (queryKeys.length > 0) {
        for (const key of queryKeys) {
          const value = this.queryItems[key]
          if (Array.isArray(value)) {
            for (const v of value) {
              params.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            }
          } else if (value !== undefined) {
            params.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
          }
        }
      }
      url += `?${params.join('&')}`
    }

    // Hash (fragment).
    if (this.fragment !== undefined) {
      url += `#${this.fragment}`
    }

    return url
  }

  /**
   * Convenience method to update the protocol.
   */
  setProtocol(newProtocol: string): this {
    if (newProtocol === '') throw new Error('Protocol is required')

    this.protocol = newProtocol
    return this
  }

  /**
   * Convenience method to update the username.
   */
  setUsername(newUsername?: string): this {
    if (newUsername === '') this.username = undefined
    else this.username = newUsername
    return this
  }

  /**
   * Convenience method to update the password.
   */
  setPassword(newPassword?: string): this {
    if (newPassword === '') this.password = undefined
    else this.password = newPassword

    return this
  }

  /**
   * Convenience method to update the hostname.
   */
  setHostname(newHostname: string): this {
    if (newHostname === '') throw new Error('Hostname is required')

    this.hostname = newHostname
    return this
  }

  /**
   * Convenience method to update the port.
   */
  setPort(newPort?: string): this {
    if (newPort === '') this.port = undefined
    else this.port = newPort
    return this
  }

  /**
   * Convenience method to update the pathname.
   */
  setPath(newPathname: string): this {
    this.path = newPathname.startsWith('/') ? newPathname : `/${newPathname}`
    return this
  }

  addPathComponent(component: string): this {
    this.path =
      (this.path ?? '') +
      (component.startsWith('/') ? component : `/${component}`)
    return this
  }

  /**
   * Replace the entire query object.
   */
  setQueryItems(newQuery?: Record<string, string | string[]>): this {
    this.queryItems = newQuery
    return this
  }

  /**
   * Update or add a single query parameter.
   */
  setQueryItem(key: string, value: string | string[]): this {
    if (this.queryItems === undefined) this.queryItems = {}

    this.queryItems[key] = value
    return this
  }

  /**
   * Remove a query parameter.
   */
  removeQueryItem(key: string): this {
    delete this.queryItems?.[key]
    return this
  }

  /**
   * Convenience method to update the hash (fragment).
   */
  setFragment(newHash: string): this {
    this.fragment = newHash
    return this
  }

  /**
   * Update the current URL components.
   *
   * Accepts either:
   * - A URL string, which may be a full URL (e.g., "https://example.com/path?foo=bar")
   *   or a partial URL (e.g., "/new/path?foo=bar#section"). In this case, only the components
   *   present in the string will be updated.
   * - A partial UrlComponents object.
   *
   * @param input - A URL string or a partial UrlComponents object.
   */
  update(input: string | Partial<URLComponents>): this {
    let components: URLComponents

    if (typeof input === 'string') {
      // If input is a string, parse and update only the provided components.
      components = parseURL(input)
    } else {
      components = input
    }

    // Otherwise, update provided fields.
    if (components.protocol !== undefined) this.setProtocol(components.protocol)
    if (components.username !== undefined) this.setUsername(components.username)
    if (components.password !== undefined) this.setPassword(components.password)
    if (components.hostname !== undefined) this.setHostname(components.hostname)
    if (components.port !== undefined) this.setPort(components.port)
    if (components.path !== undefined) this.setPath(components.path)
    if (components.queryItems !== undefined)
      this.setQueryItems(components.queryItems)
    if (components.fragment !== undefined) this.setFragment(components.fragment)

    return this
  }
}
