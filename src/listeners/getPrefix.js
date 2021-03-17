/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class ListenerGetPrefix extends Listener {
  constructor () {
    super('getPrefix', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.content === this.client.user.toString() || message.content === `<@!${this.client.user.id}>`) {
      const prefix = this.client.prefix.getPrefix(message.guild.id) ? this.client.prefix.getPrefix(message.guild.id) : this.client.config.prefix
      return message.channel.send(this.client.emoji.ok + ` My prefix for music commands in **${message.guild.name}** is \`${prefix}\` | You can run \`${prefix}prefix\` to change this.`)
    }
  }
}
