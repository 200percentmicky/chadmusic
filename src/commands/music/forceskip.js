const { Command } = require('discord-akairo');

module.exports = class CommandForceSkip extends Command {
    constructor () {
        super('forceskip', {
            aliases: ['forceskip', 'fs'],
            category: '🎶 Music',
            description: {
                text: 'Force skips the currently playing song, bypassing votes.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
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

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

        // For breaking use only.
        // this.client.player.skip(message)
        // return this.client.ui.reply(message, '⏭', process.env.COLOR_INFO, 'Skipped!')

        /*
    if (args[1] === ('--force' || '-f')) {
      if (!dj) return this.client.ui.reply(message, 'error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!')
    }
    */

        const queue = this.client.player.getQueue(message);
        if (queue.votes.length > 0) queue.votes = [];

        if (vc.members.size <= 2) {
            if (!this.client.player.getQueue(message).songs[1]) {
                this.client.player.stop(message);
                return this.client.ui.custom(message, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
            }
            this.client.player.skip(message);
            return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!');
        } else {
            if (dj) {
                this.client.player.skip(message);
                return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!');
            } else {
                return this.client.ui.send(message, 'NOT_ALONE');
            }
        }
    }
};
