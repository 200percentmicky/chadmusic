/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')
const prettyms = require('pretty-ms')

module.exports = class ListenerAddSong extends Listener {
  constructor () {
    super('addSong', {
      emitter: 'player',
      event: 'addSong'
    })
  }

  async exec (message, queue, song) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.maxTime) {
      if (!dj) {
        if (parseInt(song.duration + '000') > settings.maxTime) { // DisTube omits the last three digits in the songs duration.
          queue.songs.pop()
          return message.say('no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(settings.maxTime, { colonNotation: true })}\` for this server.`)
        }
      }
    }
    message.say('ok', `Added **${song.name}** to the queue.`)
  }
}
