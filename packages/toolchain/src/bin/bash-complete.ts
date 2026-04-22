#!/usr/bin/env node
import { proposeCompletions } from "@stricli/core";
import { buildContext } from "../context.js";
import { app } from "../app.js";
const inputs = process.argv.slice(3);
if (process.env["COMP_LINE"]?.endsWith(" ")) {
    inputs.push("");
}
await proposeCompletions(app, inputs, buildContext(process));
try {
    for (const { completion } of await proposeCompletions(app, inputs, buildContext(process))) {
        process.stdout.write(`${completion}\n`);
    }
} catch {
    // ignore
}
