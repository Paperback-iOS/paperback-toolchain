import { buildCommand, numberParser } from "@stricli/core";
import { logcat } from "./index.js";

export default buildCommand({
  func: logcat,
  parameters: {
    flags: {
      ip: { kind: "parsed", parse: String, brief: "ip of the instance to connect to", default: "127.0.0.1" },
      port: { kind: "parsed", parse: numberParser, brief: "port of the instance to connect to", default: "27015" }
    }
  },
  docs: {
    brief: "stream logs from a paperback instance"
  }
})