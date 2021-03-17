/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/*
MIT License

Copyright (c) 2021 Michael L. Dickerson (Micky-kun#3836)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * Here lies the messy outcome of a lazy programmer.
 * Either that or it's Javascripts fault.
*/

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
logger.info('///////////////////////////////////////////////')
logger.info('  * * * ChadMusic - The Chad Music Bot * * *')
logger.info('///////////////////////////////////////////////')
logger.info('Bot Version: %s', version)
// Looks like shit lol.

/* Version check */
// Discord.js require Node > 14
if (process.versions.node < '14.0.0') {
  logger.error('ChadMusic requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation. Aborting...', '14.0.0', process.versions.node)
  process.exit(1)
}

logger.info('Loading libraries...')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo')
const prefix = require('discord-prefix')
const { Structures, Intents } = require('discord.js')
const Keyv = require('keyv')
const DisTube = require('distube')
const moment = require('moment')

const config = require('./config.json')
const emoji = require('./emoji.json')
const color = require('./colorcode.json')
const urlicon = require('./urlicon.json')

/* Message Structure */
// a.k.a. The pretty embeds lol
Structures.extend('Message', () => {
  const MessageStructure = require('./modules/MessageStructure.js')
  return MessageStructure
})

/* Main Client */
class ChadMusic extends AkairoClient {
  constructor () {
    super({
      ownerID: config.owner
    }, {
      disableMentions: 'true',
      restTimeOffset: 175,
      intents: new Intents(Intents.ALL)
    })

    /* Configuration files. */
    this.config = config
    this.emoji = emoji
    this.color = color
    this.urlicon = urlicon

    /* Packages */
    this.utils = require('bot-utils')
    this.moment = moment
    this.prefix = prefix
    this.logger = logger
    this.si = require('systeminformation')
    this.player = new DisTube(this, {
      emitNewSongOnly: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      youtubeCookie: config.ytCookie,
      highWaterMark: 1 << 25,
      youtubeDL: true,
      updateYouTubeDL: false
    })

    /* Client Defaults */
    this.defaults = {
      djMode: false,
      djRole: null,
      allowFreeVolume: true,
      nowPlayingAlerts: true,
      maxTime: null,
      maxQueueLimit: null,
      textChannel: null,
      voiceChannel: null
    }

    /* Data Management */
    // Keyv is perfectly scalable for sharding. Due to its simplicity though, each new Keyv instance
    // must be made to make it multi-guild compatible.
    logger.info('Loading settings...')
    const token = process.env.POSTGRES_URI
    this.djMode = new Keyv(token, { namespace: 'djMode' })
    this.djRole = new Keyv(token, { namespace: 'djRole' })
    this.allowFreeVolume = new Keyv(token, { namespace: 'allowFreeVolume' })
    this.nowPlayingAlerts = new Keyv(token, { namespace: 'nowPlayingAlerts' })
    this.maxTime = new Keyv(token, { namespace: 'maxTime' })
    this.maxQueueLimit = new Keyv(token, { namespace: 'maxQueueLimit' })
    this.textChannel = new Keyv(token, { namespace: 'textChannel' })
    this.voiceChannel = new Keyv(token, { namespace: 'voiceChannel' })

    /* Load all commands */
    this.commands = new CommandHandler(this, {
      directory: './src/commands',
      prefix: message => message.channel.type === 'text'
        ? prefix.getPrefix(message.guild.id) || prefix.getPrefix('global') || config.prefix
        : config.prefix,
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
    })

    this.commands.useInhibitorHandler(this.inhibitors)
    this.commands.useListenerHandler(this.listeners)

    this.commands.loadAll()
    this.listeners.loadAll()

    if (process.env.NODE_ENV === 'production') {
      this.inhibitors.loadAll()
    }
  }
}

module.exports = ChadMusic
