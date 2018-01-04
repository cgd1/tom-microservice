#!/usr/bin/env node

'use strict'

const { keys, includes } = require('lodash')

const { createLog, loadConfig, wrapAction } = require('../src/helpers')
const createServer = require('./server')
const pkg = require('../package.json')
const loadCommand = require('../src')
const logo = require('./logo')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  description: false,
  flags: {
    port: {
      type: 'number',
      alias: 'p',
      default: process.env.PORT || 3000
    },
    silent: {
      alias: 's',
      type: 'boolean',
      default: false
    },
    config: {
      alias: 'c',
      type: 'string',
      default: process.cwd()
    },
    version: {
      alias: 'v'
    },
    help: {
      alias: 'h'
    }
  }
})
;(async () => {
  const { silent, command } = cli.flags

  if (!command) {
    return createServer(cli.flags, port => {
      if (!silent) {
        console.log(
          logo({
            header: `tom microservice is running`,
            description: `http://localhost:${port}`
          })
        )
      }
    })
  }

  const config = await loadConfig(cli.flags.config)
  const commands = loadCommand(config)

  if (!includes(keys(commands), command)) return cli.showHelp()

  const fn = commands[command]
  const log = createLog({ keyword: fn.name })

  return wrapAction({
    fn,
    log,
    opts: cli.flags,
    onSuccess: () => process.exit(0),
    onFail: err => process.exit(err.code || 1)
  })
})()
