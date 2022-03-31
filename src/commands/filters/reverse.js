const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandReverse extends Command {
    constructor () {
        super('reverse', {
            aliases: ['reverse'],
            category: '📢 Filter',
            description: {
                text: 'Plays the music in reverse.',
                usage: '[off]',
                details: stripIndents`
        \`[off]\` Turns off reverse if its active.
        `
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        if (allowFilters === 'dj') {
            if (!dj) {
                return this.client.ui.send(message, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'reverse', false);
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** Off');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Reverse');
                }
            } else {
                await this.client.player.setFilter(message.guild.id, 'reverse', 'areverse');
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** On');
            }
        } else {
            if (vc.id !== currentVc.channel.id) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
