/**
 * Project Wave - The Chad Music Bot
 *
 * MIT License
 *
 * Copyright (c) 2021 Michael L. Dickerson | Twitter: @200percentmicky | Discord: Micky-kun#3836
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict'

const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler, MongooseProvider } = require('discord-akairo')
const { Intents } = require('discord.js')
const DisTube = require('../../chadtube/dist').default
const moment = require('moment')
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const utils = require('bot-utils')
const mongoose = require('mongoose')
const { Database } = require('quickmongo')
const si = require('systeminformation')
const ui = require('./modules/WaveUI')

// Winston Logger
const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.label({ label: '==>' }),
    format.printf(({ timestamp, label, level, message }) => {
      return `[${timestamp}] ${label} ${level}: ${message}`
    })
  ),
  transports: [
    new transports.File({
      filename: 'console.log'
    })
  ]
})

// Log everything to the console as long as the application is not
// in "production" as stated in the .env file. Otherwise, if the
// aplication is in "production", send all logs to a file.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.printf(({ timestamp, label, level, message }) => {
        return `${chalk.black.cyan(`[${timestamp}]`)} ${label} ${level}: ${message}`
      })
    )
  }))
}

// Say hello!
const { version } = require('../package.json')
logger.info('/////////////////////////////////')
logger.info('    * * * Project Wave * * *')
logger.info('/////////////////////////////////')
logger.info('Bot Version: %s', version)

// Some dependencies such as Discord.js itself now require Node.JS version 16 or above.
if (process.versions.node < '16.0.0') {
  logger.error('Project Wave requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation.', '16.0.0', process.versions.node)
  process.exit(1)
}

/* Connecting to databases... */
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', error => logger.error('[Mongoose] Connection Error: %s', error))
  .on('ready', () => logger.info('[Mongoose] Connection established!'))

// Let's boogie!
class WaveBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: 'true',
      restTimeOffset: 175,
      intents: new Intents(5783)
    })

    // Calling packages that can be used throughout the client.
    this.utils = utils
    this.moment = moment
    this.logger = logger
    this.si = si
    this.ui = ui

    // Music Player. This is a forked version of DisTube.
    this.player = new DisTube(this, {
      emitNewSongOnly: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      youtubeCookie: process.env.YOUTUBE_COOKIE,
      ytdlOptions: {
        highWaterMark: 1 << 25
      },
      youtubeDL: true,
      updateYouTubeDL: false,
      nsfw: true // Being handled on a per guild basis, not client-wide.
    })
    this.vc = this.player.voices // @discordjs/voice

    // Bot Settings.
    this.settings = new MongooseProvider(require('./modules/SettingsProvider.js'))

    // Moderation Logs
    this.modlog = new Database(process.env.MONGO_URI_MODLOG, 'modlog')

    // Guild Tags
    this.tags = new Database(process.env.MONGO_URI_TAGS, 'tags')

    // Create Command Handler
    this.commands = new CommandHandler(this, {
      directory: './src/commands',
      prefix: message => {
        if (message.guild) {
          return this.settings.get(message.guild.id, 'prefix', process.env.PREFIX)
        }
        return process.env.PREFIX
      },
      commandUtil: true,
      handleEdits: true,
      allowMention: true
    })

    // Create Listener Handler
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    })

    // Create Inhibitor Handler
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    })

    // Set custom emitters
    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player,
      modlog: this.modlog
    })

    this.commands.useInhibitorHandler(this.inhibitors) // Use all Inhibitors.
    this.commands.useListenerHandler(this.listeners) // Use all Listeners.

    this.commands.loadAll() // Load all Inhibitors
    this.listeners.loadAll() // Load all Listeners.

    // In the case of production, load all Inhibitors.
    if (process.env.NODE_ENV === 'production') {
      this.inhibitors.loadAll()
    }
  }

  // This is required to load the mongoose provider.
  async login (token) {
    await this.settings.init()
    return super.login(token)
  }
}

module.exports = WaveBot
