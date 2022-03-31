const { Command } = require('discord-akairo');

module.exports = class CommandBassBoost extends Command {
    constructor () {
        super('bassboost', {
            aliases: ['bassboost', 'bass'],
            category: '📢 Filter',
            description: {
                text: 'Boosts the bass of the player.',
                usage: 'bassboost <gain:int>'
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
            if (!args[1]) return this.client.ui.usage(message, 'bassboost <gain:int(1-100)/off>');

            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'bassboost', false);
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Bass Boost** Off');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Bass Boost');
                }
            } else {
                const gain = parseInt(args[1]);

                if (gain < 1 || gain > 100 || isNaN(gain)) {
                    return this.client.ui.reply(message, 'error', 'Bass gain must be between **1** to **100**, or **"off"**.');
                }

                await this.client.player.setFilter(message.guild.id, 'bassboost', `bass=g=${gain}`);
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Bass Boost** Gain \`${gain}dB\``);
            }
        } else {
            if (vc.id !== currentVc.channel.id) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
