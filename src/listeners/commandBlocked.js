/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class CommandBlockedListener extends Listener {
  constructor () {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked'
    })
  }

  async exec (message, command, reason) {
    if (reason === 'owner') return message.say('no', 'Only the bot owner can execute that command.')
    if (reason === 'guild') return message.say('error', 'That command must be used in a server.')
    if (reason === 'dm') return message.say('error', 'That command must be used in a Direct Message.')
  }
}
