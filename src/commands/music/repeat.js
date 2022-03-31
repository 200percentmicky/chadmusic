const { Command } = require('discord-akairo');

module.exports = class CommandRepeat extends Command {
    constructor () {
        super('repeat', {
            aliases: ['repeat', 'loop'],
            description: {
                text: 'Toggles repeat mode for the player.',
                usage: '[mode]',
                details: '`[mode]` The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**.'
            },
            category: '🎶 Music'
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const args = message.content.split(/ +/g);
        const player = this.client.player;
        const queue = player.getQueue(message);

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');

        if (vc.members.size <= 2 || dj) {
            switch (args[1]) {
            case 'off': {
                await player.setRepeatMode(message, 0);
                this.client.ui.reply(message, 'ok', 'Repeat has been disabled.');
                break;
            }
            case 'song': {
                await player.setRepeatMode(message, 1);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔂 Repeat Song**');
                break;
            }
            case 'queue': {
                await player.setRepeatMode(message, 2);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔁 Repeat Queue**');
                break;
            }
            default: {
                if (queue.repeatMode !== 0) {
                    await player.setRepeatMode(message, 0);
                    this.client.ui.reply(message, 'ok', 'Repeat has been disabled.');
                    break;
                }
                await player.setRepeatMode(message, 1);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔂 Repeat Song**');
                break;
            }
            }
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
