import packageInfo from "../package.json" with { type: "json" }
import { buildApplication, buildRouteMap } from "@stricli/core";
import { buildInstallCommand, buildUninstallCommand } from "@stricli/auto-complete";
import serve from "./commands/serve/command.js"
import bundle from "./commands/bundle/command.js"
import logcat from "./commands/logcat/command.js"
import test from "./commands/test/command.js"

const { name, version, description } = packageInfo

const routes = buildRouteMap({
    routes: {
        bundle, logcat, serve, test,
        install: buildInstallCommand("paperback-toolchain-stricli", { bash: "__paperback-toolchain-stricli_bash_complete" }),
        uninstall: buildUninstallCommand("paperback-toolchain-stricli", { bash: true }),
    },
    docs: {
        brief: description,
        hideRoute: {
            install: true,
            uninstall: true,
        },
    },
});

export const app = buildApplication(routes, {
    name,
    versionInfo: {
        currentVersion: version,
    },
});
