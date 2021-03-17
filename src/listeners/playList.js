/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class ListenerPlayList extends Listener {
  constructor () {
    super('playList', {
      emitter: 'player',
      event: 'playList'
    })
  }

  async exec (message, queue, playlist) {
    message.say('ok', `Added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} to the queue.`)
  }
}
