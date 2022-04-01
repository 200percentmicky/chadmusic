const { Listener } = require('discord-akairo');
const { nowPlayingMsg } = require('../modules/nowPlayingMsg');

module.exports = class ListenerPlaySong extends Listener {
    constructor () {
        super('playSong', {
            emitter: 'player',
            event: 'playSong'
        });
    }

    async exec (queue, song) {
        if (song.url === 'https://cdn.discordapp.com/attachments/375453081631981568/944838120304693268/temmie98.wav') return;
        // The event is being called way too quickly for metadata to be parsed correctly
        // when a player is created. Using a setTimeout() here will allow for metadata to be parsed correctly.
        setTimeout(() => {
            nowPlayingMsg(queue, song);
        }, 500);
    }
};
