/// ChadMusic Plus!
/// A powerful music bot for your badass Discord server.

'use strict'

const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler, MongooseProvider } = require('discord-akairo')
const prefix = require('discord-prefix')
const { Structures, Intents } = require('discord.js')
const DisTube = require('../../chadtube/dist').default
const moment = require('moment')
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const utils = require('bot-utils')
const mongoose = require('mongoose')
const si = require('systeminformation')

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
// in "production" as stated in the .env file.
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
logger.info('//////////////////////////////////')
logger.info('    * * * Project Wave * * *')
logger.info('//////////////////////////////////')
logger.info('Bot Version: %s', version)

// Some dependencies such as Discord.js itself now require Node.JS version 14 or above.
if (process.versions.node < '14.0.0') {
  logger.error('Project Wave requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation. Aborting...', '14.0.0', process.versions.node)
  process.exit(1)
}

/* Connecting to databases... */
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', error => logger.error('[Mongoose] Connection Error: %s', error))
  .on('ready', () => logger.info('[Mongoose] Connection established!'))

// Extending the 'Message' class for the bot's UI.
Structures.extend('Message', () => {
  const MessageStructure = require('./modules/MessageStructure.js')
  return MessageStructure
})

/* Main Client */
// The main overall client of the bot extending off of the 'AkairoClient' class.
class WaveBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: 'true',
      restTimeOffset: 175,
      intents: new Intents(Intents.ALL)
    })

    /* Packages */
    // Calling packages that can be used throughout the client.
    this.utils = utils
    this.moment = moment
    this.prefix = prefix
    this.logger = logger
    this.si = si

    /* DisTube Player */
    // The meat and potatoes of the bot. Runs off of a fork that may remove some core features.
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

    /* Data Management */
    this.settings = new MongooseProvider(require('./modules/SettingsProvider.js'))

    /* Load all commands */
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

    /* Load all Listeners */
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    })

    /* Load all Inhibitors */
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    })

    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player
    })

    this.commands.useInhibitorHandler(this.inhibitors)
    this.commands.useListenerHandler(this.listeners)

    this.commands.loadAll()
    this.listeners.loadAll()

    if (process.env.NODE_ENV === 'production') {
      this.inhibitors.loadAll()
    }
  }

  /* Load Mongoose Provider */
  async login (token) {
    await this.settings.init()
    return super.login(token)
  }
}

module.exports = WaveBot
