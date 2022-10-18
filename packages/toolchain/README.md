oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @paperback/toolchain
$ paperback COMMAND
running command...
$ paperback (--version)
@paperback/toolchain/0.8.0-alpha.34 darwin-arm64 node-v16.13.0
$ paperback --help [COMMAND]
USAGE
  $ paperback COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`paperback bundle`](#paperback-bundle)
* [`paperback help [COMMAND]`](#paperback-help-command)
* [`paperback logcat`](#paperback-logcat)
* [`paperback migrate`](#paperback-migrate)
* [`paperback plugins`](#paperback-plugins)
* [`paperback plugins:install PLUGIN...`](#paperback-pluginsinstall-plugin)
* [`paperback plugins:inspect PLUGIN...`](#paperback-pluginsinspect-plugin)
* [`paperback plugins:install PLUGIN...`](#paperback-pluginsinstall-plugin-1)
* [`paperback plugins:link PLUGIN`](#paperback-pluginslink-plugin)
* [`paperback plugins:uninstall PLUGIN...`](#paperback-pluginsuninstall-plugin)
* [`paperback plugins:uninstall PLUGIN...`](#paperback-pluginsuninstall-plugin-1)
* [`paperback plugins:uninstall PLUGIN...`](#paperback-pluginsuninstall-plugin-2)
* [`paperback plugins update`](#paperback-plugins-update)
* [`paperback serve`](#paperback-serve)
* [`paperback test [SOURCE]`](#paperback-test-source)

## `paperback bundle`

Builds all the sources in the repository and generates a versioning file

```
USAGE
  $ paperback bundle [-h] [--folder <value>]

FLAGS
  -h, --help        Show CLI help.
  --folder=<value>  Subfolder to output to

DESCRIPTION
  Builds all the sources in the repository and generates a versioning file
```

_See code: [dist/commands/bundle.ts](https://github.com/Paperback-iOS/toolchain/blob/v0.8.0-alpha.34/dist/commands/bundle.ts)_

## `paperback help [COMMAND]`

Display help for paperback.

```
USAGE
  $ paperback help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for paperback.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `paperback logcat`

describe the command here

```
USAGE
  $ paperback logcat [--ip <value>] [--port <value>]

FLAGS
  --ip=<value>    [default: localhost]
  --port=<value>  [default: 27015]

DESCRIPTION
  describe the command here
```

_See code: [dist/commands/logcat.ts](https://github.com/Paperback-iOS/toolchain/blob/v0.8.0-alpha.34/dist/commands/logcat.ts)_

## `paperback migrate`

Migrate 0.7 sources to 0.8

```
USAGE
  $ paperback migrate

DESCRIPTION
  Migrate 0.7 sources to 0.8

EXAMPLES
  $ paperback migrate
```

_See code: [dist/commands/migrate.ts](https://github.com/Paperback-iOS/toolchain/blob/v0.8.0-alpha.34/dist/commands/migrate.ts)_

## `paperback plugins`

List installed plugins.

```
USAGE
  $ paperback plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ paperback plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `paperback plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ paperback plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ paperback plugins add

EXAMPLES
  $ paperback plugins:install myplugin 

  $ paperback plugins:install https://github.com/someuser/someplugin

  $ paperback plugins:install someuser/someplugin
```

## `paperback plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ paperback plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ paperback plugins:inspect myplugin
```

## `paperback plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ paperback plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ paperback plugins add

EXAMPLES
  $ paperback plugins:install myplugin 

  $ paperback plugins:install https://github.com/someuser/someplugin

  $ paperback plugins:install someuser/someplugin
```

## `paperback plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ paperback plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ paperback plugins:link myplugin
```

## `paperback plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback plugins unlink
  $ paperback plugins remove
```

## `paperback plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback plugins unlink
  $ paperback plugins remove
```

## `paperback plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ paperback plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperback plugins unlink
  $ paperback plugins remove
```

## `paperback plugins update`

Update installed plugins.

```
USAGE
  $ paperback plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `paperback serve`

Build the sources and start a local server

```
USAGE
  $ paperback serve [-h] [-p <value>]

FLAGS
  -h, --help          Show CLI help.
  -p, --port=<value>  [default: 8080]

DESCRIPTION
  Build the sources and start a local server
```

_See code: [dist/commands/serve.ts](https://github.com/Paperback-iOS/toolchain/blob/v0.8.0-alpha.34/dist/commands/serve.ts)_

## `paperback test [SOURCE]`

describe the command here

```
USAGE
  $ paperback test [SOURCE] [--ip <value>] [--port <value>]

ARGUMENTS
  SOURCE  (optional) The source to test

FLAGS
  --ip=<value>
  --port=<value>  [default: 27015]

DESCRIPTION
  describe the command here
```

_See code: [dist/commands/test.ts](https://github.com/Paperback-iOS/toolchain/blob/v0.8.0-alpha.34/dist/commands/test.ts)_
<!-- commandsstop -->
