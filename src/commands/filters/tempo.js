const { Command } = require('discord-akairo');

module.exports = class CommandTempo extends Command {
    constructor () {
        super('tempo', {
            aliases: ['tempo'],
            category: '📢 Filter',
            description: {
                text: 'Changes the tempo of the playing track.',
                usage: '<rate:int[0.1-10]>',
                details: '`<rate:int[0.1-10]>` The rate to change. Between 0.1-10'
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
            if (!args[1]) {
                return this.client.ui.usage(message, 'tempo <rate:int[0.1-10]/off>');
            }

            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'tempo', false);
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Tempo** Reverted');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Tempo');
                }
            }

            const rate = parseInt(args[1]);
            if (isNaN(rate)) {
                return this.client.ui.reply(message, 'error', 'Tempo requires a number or **off**.');
            }
            if (rate < 0.1 || rate > 11) {
                return this.client.ui.reply(message, 'error', 'Tempo must be between **0.1-10** or **off**.');
            }
            await this.client.player.setFilter(message, 'tempo', `rubberband=tempo=${rate}`);
            return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Tempo** Rate: \`${rate}\``);
        } else {
            if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
};
