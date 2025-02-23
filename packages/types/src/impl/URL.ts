
/**
 * An interface representing the components of a URL.
 */
export interface UrlComponents {
  protocol: string; // e.g., "https:"
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  query: Record<string, string | string[]>;
  hash: string; // e.g., "#section"
}

/**
 * A class for parsing, updating, and building URLs.
 *
 * The class does not use the built‑in URL class or named regex capture groups.
 */
export class URL {
  protocol = ""
  username = ""
  password = ""
  hostname = ""
  port = ""
  pathname = ""
  query: Record<string, string | string[]> = {}
  hash = ""

  /**
   * Creates a new SimpleURL instance.
   * @param url - (Optional) A URL string to initialize the instance.
   */
  constructor(url?: string) {
    if (url) {
      this._parse(url);
    } else {
      // Set default values.
      this.protocol = "http:";
      this.username = "";
      this.password = "";
      this.hostname = "localhost";
      this.port = "";
      this.pathname = "";
      this.query = {};
      this.hash = "";
    }
  }

  /**
   * Returns the full URL string built from the current components.
   */
  toString(): string {
    let url = "";

    // Protocol and authority separator.
    url += this.protocol;
    url += "//";

    // Append user info if available.
    if (this.username) {
      url += this.username;
      if (this.password) {
        url += `:${this.password}`;
      }
      url += "@";
    }

    // Hostname and port.
    url += this.hostname;
    if (this.port) {
      url += `:${this.port}`;
    }

    // Pathname.
    if (this.pathname) {
      url += this.pathname.startsWith("/") ? this.pathname : `/${this.pathname}`;
    }

    // Query string.
    const queryKeys = Object.keys(this.query);
    if (queryKeys.length > 0) {
      const params: string[] = [];
      for (const key of queryKeys) {
        const value = this.query[key];
        if (Array.isArray(value)) {
          for (const v of value) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
          }
        } else {
          params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      }
      url += `?${params.join('&')}`;
    }

    // Hash (fragment).
    if (this.hash) {
      url += this.hash.startsWith("#") ? this.hash : `#${this.hash}`;
    }

    return url;
  }

  /**
   * Convenience method to update the protocol.
   */
  setProtocol(newProtocol: string): this {
    this.protocol = newProtocol.endsWith(":") ? newProtocol : `${newProtocol}:`;
    return this;
  }

  /**
   * Convenience method to update the username.
   */
  setUsername(newUsername: string): this {
    this.username = newUsername;
    return this;
  }

  /**
   * Convenience method to update the password.
   */
  setPassword(newPassword: string): this {
    this.password = newPassword;
    return this;
  }

  /**
   * Convenience method to update the hostname.
   */
  setHostname(newHostname: string): this {
    this.hostname = newHostname;
    return this;
  }

  /**
   * Convenience method to update the port.
   */
  setPort(newPort: string): this {
    this.port = newPort;
    return this;
  }

  /**
   * Convenience method to update the pathname.
   */
  setPathname(newPathname: string): this {
    this.pathname = newPathname.startsWith("/") ? newPathname : `/${newPathname}`;
    return this;
  }

  /**
   * Replace the entire query object.
   */
  setQuery(newQuery: Record<string, string | string[]>): this {
    this.query = newQuery;
    return this;
  }

  /**
   * Update or add a single query parameter.
   */
  setQueryParam(key: string, value: string | string[]): this {
    this.query[key] = value;
    return this;
  }

  /**
   * Remove a query parameter.
   */
  removeQueryParam(key: string): this {
    delete this.query[key];
    return this;
  }

  /**
   * Convenience method to update the hash (fragment).
   */
  setHash(newHash: string): this {
    this.hash = newHash.startsWith("#") ? newHash : `#${newHash}`;
    return this;
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
  update(input: string | Partial<UrlComponents>): this {
    if (typeof input === "string") {
      // If input is a string, parse and update only the provided components.
      this._parse(input, true);
    } else {
      // Otherwise, update provided fields.
      if (input.protocol !== undefined) this.setProtocol(input.protocol);
      if (input.username !== undefined) this.username = input.username;
      if (input.password !== undefined) this.password = input.password;
      if (input.hostname !== undefined) this.hostname = input.hostname;
      if (input.port !== undefined) this.port = input.port;
      if (input.pathname !== undefined) this.setPathname(input.pathname);
      if (input.query !== undefined) this.query = input.query;
      if (input.hash !== undefined) this.setHash(input.hash);
    }
    return this;
  }

  /**
   * Internal method to parse a URL string and update the current components.
   *
   * @param url - The URL string to parse.
   * @param partial - If true, only update components present in the input.
   */
  private _parse(url: string, partial: boolean = false): void {
    // Regular expression using numbered capture groups.
    // Capture groups:
    //   1: protocol, 2: authority, 3: pathname, 4: query, 5: hash.
    const regex = /^(?:([a-zA-Z][a-zA-Z\d+\-.]*:))?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid URL string provided.");
    }

    // Only update a component if the capture group is defined and (for some components) non-empty.
    if (match[1] !== undefined && match[1] !== "") {
      this.setProtocol(match[1]);
    } else if (!partial && !this.protocol) {
      // For a full parse, set default if missing.
      this.protocol = "";
    }

    if (match[2] !== undefined && match[2] !== "") {
      // Parse authority into username, password, hostname, and port.
      let authority = match[2];
      let userInfo = "";
      let hostPort = "";
      const atIndex = authority.indexOf("@");
      if (atIndex !== -1) {
        userInfo = authority.substring(0, atIndex);
        hostPort = authority.substring(atIndex + 1);
        if (userInfo !== "") {
          const colonIndex = userInfo.indexOf(":");
          if (colonIndex !== -1) {
            this.username = userInfo.substring(0, colonIndex);
            this.password = userInfo.substring(colonIndex + 1);
          } else {
            this.username = userInfo;
            this.password = "";
          }
        }
      } else {
        hostPort = authority;
      }
      if (hostPort !== "") {
        if (hostPort.startsWith("[")) {
          const closingBracketIndex = hostPort.indexOf("]");
          if (closingBracketIndex === -1) {
            throw new Error("Invalid IPv6 address in URL update.");
          }
          this.hostname = hostPort.substring(0, closingBracketIndex + 1);
          const portPart = hostPort.substring(closingBracketIndex + 1);
          if (portPart.startsWith(":")) {
            this.port = portPart.substring(1);
          }
        } else {
          const colonIndex = hostPort.lastIndexOf(":");
          if (colonIndex !== -1 && hostPort.indexOf(":") === colonIndex) {
            this.hostname = hostPort.substring(0, colonIndex);
            this.port = hostPort.substring(colonIndex + 1);
          } else {
            this.hostname = hostPort;
            this.port = "";
          }
        }
      }
    } else if (!partial && !this.hostname) {
      this.hostname = "";
    }

    // Pathname.
    if (match[3] !== undefined && match[3] !== "") {
      this.pathname = match[3].startsWith("/") ? match[3] : `/${match[3]}`;
    } else if (!partial && !this.pathname) {
      this.pathname = "";
    }

    // Query.
    if (match[4] !== undefined && match[4] !== "") {
      const query: Record<string, string | string[]> = {};
      const pairs = match[4].split("&");
      for (const pair of pairs) {
        if (!pair) continue;
        const [rawKey, rawValue = ""] = pair.split("=");
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(rawValue);
        if (key in query) {
          const existing = query[key];
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            query[key] = [existing, value];
          }
        } else {
          query[key] = value;
        }
      }
      this.query = query;
    } else if (!partial && !this.query) {
      this.query = {};
    }

    // Hash.
    if (match[5] !== undefined && match[5] !== "") {
      this.hash = `#${match[5]}`;
    } else if (!partial && !this.hash) {
      this.hash = "";
    }
  }
}
