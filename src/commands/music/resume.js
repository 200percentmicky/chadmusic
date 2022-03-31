const { Command } = require('discord-akairo');

module.exports = class CommandResume extends Command {
    constructor () {
        super('resume', {
            aliases: ['resume', 'unpause'],
            category: '🎶 Music',
            description: {
                text: 'Unpauses the player, resuming playback.'
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

        const queue = this.client.player.getQueue(message);

        const currentVc = this.client.vc.get(vc);
        if (!queue || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size <= 2 || dj) {
            if (!queue.paused) return this.client.ui.reply(message, 'warn', 'The player is not paused.');
            await queue.resume();
            return this.client.ui.custom(message, '▶', process.env.COLOR_INFO, 'Resuming playback...');
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
