const { Command } = require('discord-akairo');
const { shuffle } = require('../../aliases.json');

module.exports = class CommandShuffle extends Command {
    constructor () {
        super(shuffle !== undefined ? shuffle[0] : 'shuffle', {
            aliases: shuffle || ['shuffle'],
            category: '🎶 Music',
            description: {
                text: 'Randomizes the entries in the queue.'
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
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (vc.members.size <= 2 || dj) {
            if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

            this.client.player.shuffle(message);
            return this.client.ui.reply(message, 'ok', `**${queue.songs.length - 1}** entries have been shuffled.`);
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
