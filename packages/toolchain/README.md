# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [oclif-hello-world](#oclif-hello-world)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @paperback/toolchain
$ paperback-cli COMMAND
running command...
$ paperback-cli (--version)
@paperback/toolchain/1.0.0-alpha.57 darwin-arm64 node-v22.16.0
$ paperback-cli --help [COMMAND]
USAGE
  $ paperback-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`paperback-cli bundle`](#paperback-cli-bundle)
* [`paperback-cli help [COMMAND]`](#paperback-cli-help-command)
* [`paperback-cli logcat [FILE]`](#paperback-cli-logcat-file)
* [`paperback-cli plugins`](#paperback-cli-plugins)
* [`paperback-cli plugins add PLUGIN`](#paperback-cli-plugins-add-plugin)
* [`paperback-cli plugins:inspect PLUGIN...`](#paperback-cli-pluginsinspect-plugin)
* [`paperback-cli plugins install PLUGIN`](#paperback-cli-plugins-install-plugin)
* [`paperback-cli plugins link PATH`](#paperback-cli-plugins-link-path)
* [`paperback-cli plugins remove [PLUGIN]`](#paperback-cli-plugins-remove-plugin)
* [`paperback-cli plugins reset`](#paperback-cli-plugins-reset)
* [`paperback-cli plugins uninstall [PLUGIN]`](#paperback-cli-plugins-uninstall-plugin)
* [`paperback-cli plugins unlink [PLUGIN]`](#paperback-cli-plugins-unlink-plugin)
* [`paperback-cli plugins update`](#paperback-cli-plugins-update)
* [`paperback-cli serve`](#paperback-cli-serve)
* [`paperback-cli test [EXTENSION]`](#paperback-cli-test-extension)

## `paperback-cli bundle`

Builds all the sources in the repository and generates a versioning file

```
USAGE
  $ paperback-cli bundle [--folder <value>] [-h] [--debug] [--tests]

FLAGS
  -h, --help            Show CLI help.
  --debug
      --folder=<value>  Subfolder to output to
  --tests

DESCRIPTION
  Builds all the sources in the repository and generates a versioning file
```

_See code: [lib/commands/bundle.js](https://github.com/FaizanDurrani/paperback-toolchain/blob/v1.0.0-alpha.57/lib/commands/bundle.js)_

## `paperback-cli help [COMMAND]`

Display help for paperback-cli.

```
USAGE
  $ paperback-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for paperback-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `paperback-cli logcat [FILE]`

describe the command here

```
USAGE
  $ paperback-cli logcat [FILE] [--ip <value>] [--port <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  --ip=<value>    [default: localhost]
  --port=<value>  [default: 27015]

DESCRIPTION
  describe the command here

EXAMPLES
  $ paperback-cli logcat
```

_See code: [lib/commands/logcat.js](https://github.com/FaizanDurrani/paperback-toolchain/blob/v1.0.0-alpha.57/lib/commands/logcat.js)_

## `paperback-cli plugins`

List installed plugins.

```
USAGE
  $ paperback-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ paperback-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/index.ts)_

## `paperback-cli plugins add PLUGIN`

Installs a plugin into paperback-cli.

```
USAGE
  $ paperback-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into paperback-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PAPERBACK_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PAPERBACK_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ paperback-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ paperback-cli plugins add myplugin

  Install a plugin from a github url.

    $ paperback-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ paperback-cli plugins add someuser/someplugin
```

## `paperback-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ paperback-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ paperback-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/inspect.ts)_

## `paperback-cli plugins install PLUGIN`

Installs a plugin into paperback-cli.

```
USAGE
  $ paperback-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into paperback-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PAPERBACK_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PAPERBACK_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ paperback-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ paperback-cli plugins install myplugin

  Install a plugin from a github url.

    $ paperback-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ paperback-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/install.ts)_

## `paperback-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ paperback-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ paperback-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/link.ts)_

## `paperback-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback-cli plugins unlink
  $ paperback-cli plugins remove

EXAMPLES
  $ paperback-cli plugins remove myplugin
```

## `paperback-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ paperback-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/reset.ts)_

## `paperback-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback-cli plugins unlink
  $ paperback-cli plugins remove

EXAMPLES
  $ paperback-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/uninstall.ts)_

## `paperback-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback-cli plugins unlink
  $ paperback-cli plugins remove

EXAMPLES
  $ paperback-cli plugins unlink myplugin
```

## `paperback-cli plugins update`

Update installed plugins.

```
USAGE
  $ paperback-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/update.ts)_

## `paperback-cli serve`

Build the sources and start a local server

```
USAGE
  $ paperback-cli serve [-h] [-p <value>] [-w]

FLAGS
  -h, --help          Show CLI help.
  -p, --port=<value>  [default: 8080]
  -w, --watch         Watch for file changes and rebuild automatically

DESCRIPTION
  Build the sources and start a local server
```

_See code: [lib/commands/serve.js](https://github.com/FaizanDurrani/paperback-toolchain/blob/v1.0.0-alpha.57/lib/commands/serve.js)_

## `paperback-cli test [EXTENSION]`

describe the command here

```
USAGE
  $ paperback-cli test [EXTENSION] [--testCase <value>] [--dryRun]

ARGUMENTS
  EXTENSION  The ID for the extension that should be tested

FLAGS
  --dryRun            dry run
  --testCase=<value>  test case

DESCRIPTION
  describe the command here

EXAMPLES
  $ paperback-cli test
```

_See code: [lib/commands/test.js](https://github.com/FaizanDurrani/paperback-toolchain/blob/v1.0.0-alpha.57/lib/commands/test.js)_
<!-- commandsstop -->
