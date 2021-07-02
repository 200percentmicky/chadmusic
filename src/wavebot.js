/// Project Wave

/* Main File */

'use strict'

/* Winston Logging */
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
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

/* Stops logging to console if in production */
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
// Looks like shit lol.

/* Version check */
// Discord.js require Node > 14
if (process.versions.node < '14.0.0') {
  logger.error('Project Wave requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation. Aborting...', '14.0.0', process.versions.node)
  process.exit(1)
}

logger.info('Loading libraries...')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler, MongooseProvider } = require('discord-akairo')
const prefix = require('discord-prefix')
const { Structures, Intents } = require('discord.js')
const DisTube = require('distube')
const moment = require('moment')
// const Moderator = require('discord-moderator')

/* Connecting to databases... */
const { Database } = require('quickmongo')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', error => logger.error('[Mongoose] Connection Error: %s', error))
  .on('ready', () => logger.info('[Mongoose] Connection established!'))

// const config = require('./config.json')
const emoji = require('./emoji.json')
const color = require('./colorcode.json')
const urlicon = require('./urlicon.json')

/* Message Structure */
// a.k.a. The pretty embeds lol
Structures.extend('Message', () => {
  const MessageStructure = require('./modules/MessageStructure.js')
  return MessageStructure
})
Structures.extend('Guild', () => {
  const GuildStructure = require('./modules/GuildStructure.js')
  return GuildStructure
})

/* Main Client */
class WaveBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: 'true',
      restTimeOffset: 175,
      intents: new Intents(Intents.ALL)
    })

    /* Configuration files. */
    // this.config = config
    this.emoji = emoji
    this.color = color
    this.urlicon = urlicon

    /* Packages */
    this.utils = require('bot-utils')
    this.moment = moment
    this.prefix = prefix
    this.logger = logger
    this.si = require('systeminformation')
    this.player = new DisTube.DisTube(this, {
      emitNewSongOnly: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      youtubeCookie: process.env.YOUTUBE_COOKIE,
      ytdlOptions: {
        highWaterMark: 1 << 25
      },
      youtubeDL: true,
      updateYouTubeDL: true,
      nsfw: true // Being handled on a per guild basis, not client-wide.
    })
    this.vc = this.player.voices

    /* Management for mutes and warns. */
    /*
    this.moderator = new Moderator(this, {
      mutesTableName: 'mutes',
      checkMutesCountdown: 20000,
      warnsTableName: 'warns'
    })
    */

    /* Data Management */
    this.settings = new MongooseProvider(require('./modules/SettingsProvider.js'))
    this.modlog = new Database(process.env.MONGO_URI_MODLOG)
    this.blocklist = new Database(process.env.MONGO_URI_BLOCKLIST)

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
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    })
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    })

    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player
      // modlog: this.modlog
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
