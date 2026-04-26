import { buildCommand, numberParser } from "@stricli/core";
import { test } from "./index.js";

export default buildCommand({
  func: test,
  parameters: {
    flags: {
      generate: { kind: "boolean", brief: "generate default tests" },
      overwrite: { kind: "boolean", brief: "overwrite existing tests", default: false },
      output: { kind: "parsed", brief: "output file", parse: String, optional: true },
      console: { kind: "boolean", brief: "display captured console", default: true }
    },
    positional: {
      kind: 'tuple',
      parameters: [
        { brief: "sourceId of the source that should be tested", optional: true, parse: String }
      ]
    }
  },
  docs: {
    brief: "stream logs from a paperback instance"
  }
})