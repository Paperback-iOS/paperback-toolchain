import { type TestLogger } from '@paperback/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type ConsoleMethod = 'log' | 'warn' | 'error' | 'info' | 'debug'

export interface ConsoleEntry {
  time: number
  args: unknown[]
  method: ConsoleMethod
}

type ObjectNode = Record<string, unknown>
type ArrayNode = ObjectNode[]

// ─── Logger ───────────────────────────────────────────────────────────────────

/**
 * A single recursive logger class.
 *
 * Every instance wraps one node in the output tree, which is either:
 *   - an ObjectNode  → supports .log(), .scope(), .list(), .console()
 *   - an ArrayNode   → .scope(name) appends a new { name } entry and returns
 *                      a Logger on it (enabling list().scope() chaining)
 *
 * Nodes are shared by reference, so child writes propagate up instantly.
 * Nesting is unlimited.
 */
export class Logger implements TestLogger {
  private _node: ObjectNode | ArrayNode

  constructor(node: ObjectNode | ArrayNode = {}) {
    this._node = node
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private get _isArray(): boolean {
    return Array.isArray(this._node)
  }

  private get _obj(): ObjectNode {
    if (this._isArray)
      throw new Error(
        'This logger wraps a list — call .scope(name) to create an entry first.'
      )
    return this._node as ObjectNode
  }

  private get _arr(): ArrayNode {
    if (!this._isArray)
      throw new Error(
        'This logger wraps an object — use .list(name) to get a list logger.'
      )
    return this._node as ArrayNode
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Write a key/value pair into the current object node.
   *
   *   logger.log("result", "passed")
   */
  log(key: string, value: unknown): this {
    this._obj[key] = value
    return this
  }

  /**
   * Get or create a named child **object** node.
   * When called on an array node, appends a new `{ name }` entry instead.
   *
   *   // object mode
   *   logger.scope("runner").log("value", 42)
   *
   *   // array mode (returned by .list())
   *   logger.list("tests").scope("test1").log("result", "passed")
   */
  scope(name: string): Logger {
    if (this._isArray) {
      // Append a new named entry to the array and return a Logger on it.
      const entry: ObjectNode = { name }
      this._arr.push(entry)
      return new Logger(entry)
    }

    // Get or create a named child object.
    if (!(name in this._obj)) this._obj[name] = {}
    return new Logger(this._obj[name] as ObjectNode)
  }

  /**
   * Get or create a named child **array** node.
   * Use the returned Logger's .scope(name) to append entries.
   *
   *   const tests = logger.list("tests")
   *   const t1 = tests.scope("test1")   // appends { name: "test1" }
   *   t1.log("result", "passed")
   */
  list(name: string): Logger {
    if (!(name in this._obj)) this._obj[name] = []
    return new Logger(this._obj[name] as ArrayNode)
  }

  /**
   * Return a Console-compatible shim that captures calls into a `console`
   * array on this node. Assign to globalThis.console before running a suite.
   *
   *   globalThis.console = suiteLogger.console()
   */
  console(): Console {
    if (!Array.isArray(this._obj['console'])) this._obj['console'] = []
    const entries = this._obj['console'] as ConsoleEntry[]

    const capture =
      (method: ConsoleMethod) =>
      (...args: unknown[]): void => {
        entries.push({ time: Date.now(), args, method })
      }

    return {
      log: capture('log'),
      warn: capture('warn'),
      error: capture('error'),
      info: capture('info'),
      debug: capture('debug'),
      assert: () => {},
      clear: () => {},
      count: () => {},
      countReset: () => {},
      dir: () => {},
      dirxml: () => {},
      group: () => {},
      groupCollapsed: () => {},
      groupEnd: () => {},
      table: () => {},
      time: () => {},
      timeEnd: () => {},
      timeLog: () => {},
      timeStamp: () => {},
      trace: () => {},
      profile: () => {},
      profileEnd: () => {},
    } as unknown as Console
  }

  /**
   * Serialise the current node (and all descendants) to a plain JS value.
   * Safe to call at any point; returns a deep clone.
   */
  raw(): unknown {
    return JSON.parse(JSON.stringify(this._node))
  }
}
