# apto - an SFDX Plugin to automate via puppeteer.

### _apto: to fit, adapt, adjust, make ready_

APIs for configuring elements that have no REST/SOAP API equvalient on the Salesforce platform.

[![Version](https://img.shields.io/npm/v/apto.svg)](https://npmjs.org/package/apto)
[![CircleCI](https://circleci.com/gh/zerkz/apto/tree/main.svg?style=shield)](https://circleci.com/gh/zerkz/apto/tree/main)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/zerkz/apto?branch=main&svg=true)](https://ci.appveyor.com/project/heroku/apto/branch/main)
[![Greenkeeper](https://badges.greenkeeper.io/zerkz/apto.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/zerkz/apto/badge.svg)](https://snyk.io/test/github/zerkz/apto)
[![Downloads/week](https://img.shields.io/npm/dw/apto.svg)](https://npmjs.org/package/apto)
[![License](https://img.shields.io/npm/l/apto.svg)](https://github.com/zerkz/apto/blob/main/package.json)

<!-- toc -->
* [apto - an SFDX Plugin to automate via puppeteer.](#apto---an-sfdx-plugin-to-automate-via-puppeteer)
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
sfdx plugins:install @zdware/apto 
<!-- installstop -->
<!-- commands -->
* [`sfdx apto:cache:clear [-n <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-aptocacheclear--n-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx apto:cache:clear [-n <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Clear/invalidate a Platform cache.

```
USAGE
  $ sfdx apto:cache:clear [-n <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --name=name                                                                   Name of the Platform Cache
                                                                                    partition.

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx apto:cache:clear --targetusername myOrg@example.com 
       Clear operation for the Platform cache partition 'default_cache' was successful
  
  $ sfdx apto:cache:clear -u myOrg@example.com -n foo
       Clear operation for the Platform cache partition 'foo' was successful
```

_See code: [src/commands/apto/cache/clear.ts](https://github.com/zerkz/apto/blob/v0.1.0/src/commands/apto/cache/clear.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
