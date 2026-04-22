import { buildCommand, numberParser } from "@stricli/core";
import { test } from "./index.js";

export default buildCommand({
  func: test,
  parameters: {
    flags: {
      generate: { kind: "boolean", brief: "generate default tests" }
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