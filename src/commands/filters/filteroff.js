const { Command } = require('discord-akairo');

module.exports = class CommandFilterOff extends Command {
    constructor () {
        super('filteroff', {
            aliases: ['filteroff', 'filtersoff', 'foff'],
            category: '📢 Filter',
            description: {
                text: 'Removes all filters from the player.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
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
            if (!queue.filters) return this.client.ui.reply(message, 'error', 'No filters are currently applied to the player.');
            await this.client.player.setFilter(message.guild.id, false);
            return this.client.ui.reply(message, 'info', 'Removed all filters from the player.');
        } else {
            if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
};
