/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    // In the case that the client is Poki#7585, the following commands
    // will be disabled to avoid conflict, and the activity will not
    // be applied when the client is ready.
    if (this.client.user.id === '375450533114413056') {
      const aliases = require('../aliases.json')
      this.client.commands.remove(aliases.invite[0] || 'invite')

      this.client.logger.info('[Ready!<3♪] Let\'s party!!')
      this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)
    } else {
      const activity = async () => {
        const serverSize = this.client.guilds.cache.size === '1' ? `${this.client.guilds.cache.size} server` : `${this.client.guilds.cache.size} servers`
        await this.client.user.setActivity(`${this.client.config.prefix}help | Getting turnt in ${serverSize}.`)
      }
      setInterval(activity, 120000)

      this.client.logger.info('[Ready!<3♪] Let\'s party!!')
      this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)

      return activity()
    }
  }
}
