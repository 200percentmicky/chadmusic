/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class ListenerCooldown extends Listener {
  constructor () {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown'
    })
  }

  async exec (message, command, remaining) {
    if (command) {
      const seconds = remaining / 1000.00
      const time = parseFloat(seconds).toFixed(2)
      message.say(`Slow down, ${message.author.toString()}! Try again in **${time}** seconds.`, null, this.client.color.no, '⏳').then(sent => {
        setTimeout(() => {
          sent.delete()
        }, 5000)
      })
    }
  }
}
