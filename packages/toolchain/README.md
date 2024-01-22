oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g toolchain
$ paperback-cli COMMAND
running command...
$ paperback-cli (--version)
toolchain/0.0.0 darwin-arm64 node-v18.18.2
$ paperback-cli --help [COMMAND]
USAGE
  $ paperback-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`paperback-cli hello PERSON`](#paperback-cli-hello-person)
* [`paperback-cli hello world`](#paperback-cli-hello-world)
* [`paperback-cli help [COMMANDS]`](#paperback-cli-help-commands)
* [`paperback-cli plugins`](#paperback-cli-plugins)
* [`paperback-cli plugins:install PLUGIN...`](#paperback-cli-pluginsinstall-plugin)
* [`paperback-cli plugins:inspect PLUGIN...`](#paperback-cli-pluginsinspect-plugin)
* [`paperback-cli plugins:install PLUGIN...`](#paperback-cli-pluginsinstall-plugin-1)
* [`paperback-cli plugins:link PLUGIN`](#paperback-cli-pluginslink-plugin)
* [`paperback-cli plugins:uninstall PLUGIN...`](#paperback-cli-pluginsuninstall-plugin)
* [`paperback-cli plugins reset`](#paperback-cli-plugins-reset)
* [`paperback-cli plugins:uninstall PLUGIN...`](#paperback-cli-pluginsuninstall-plugin-1)
* [`paperback-cli plugins:uninstall PLUGIN...`](#paperback-cli-pluginsuninstall-plugin-2)
* [`paperback-cli plugins update`](#paperback-cli-plugins-update)

## `paperback-cli hello PERSON`

Say hello

```
USAGE
  $ paperback-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/FaizanDurrani/paperback-toolchain/blob/v0.0.0/src/commands/hello/index.ts)_

## `paperback-cli hello world`

Say hello world

```
USAGE
  $ paperback-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ paperback-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/FaizanDurrani/paperback-toolchain/blob/v0.0.0/src/commands/hello/world.ts)_

## `paperback-cli help [COMMANDS]`

Display help for paperback-cli.

```
USAGE
  $ paperback-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for paperback-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/index.ts)_

## `paperback-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ paperback-cli plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ paperback-cli plugins add

EXAMPLES
  $ paperback-cli plugins add myplugin 

  $ paperback-cli plugins add https://github.com/someuser/someplugin

  $ paperback-cli plugins add someuser/someplugin
```

## `paperback-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ paperback-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/inspect.ts)_

## `paperback-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ paperback-cli plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ paperback-cli plugins add

EXAMPLES
  $ paperback-cli plugins install myplugin 

  $ paperback-cli plugins install https://github.com/someuser/someplugin

  $ paperback-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/install.ts)_

## `paperback-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ paperback-cli plugins link PLUGIN

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/link.ts)_

## `paperback-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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
  $ paperback-cli plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/reset.ts)_

## `paperback-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/uninstall.ts)_

## `paperback-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback-cli plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.19/src/commands/plugins/update.ts)_
<!-- commandsstop -->
