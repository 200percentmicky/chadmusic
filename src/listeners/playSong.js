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
        // The event is being called way too quickly for metadata to be parsed correctly
        // when a player is created. Using a setTimeout() here will allow for metadata to be parsed correctly.
        setTimeout(() => {
            nowPlayingMsg(queue, song);
        }, 500);
    }
};
