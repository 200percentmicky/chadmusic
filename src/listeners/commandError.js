/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class ListenerCommandError extends Listener {
  constructor () {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    })
  }

  async exec (error, message, command) {
    message.channel.send(`💢 \`Bruh Moment in command '${command.id}'. An error report was sent to the bot owner.\``)
    message.recordError('error', command, 'Command Error', error.stack)
  }
}
