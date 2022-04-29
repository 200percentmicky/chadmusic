const { Command } = require('discord-akairo');

module.exports = class CommandCrystalize extends Command {
    constructor () {
        super('crystalize', {
            aliases: ['crystalize', 'crystal'],
            category: '📢 Filter',
            description: {
                text: 'Sharpens or softens the audio quality.',
                usage: '<intensity:int(-10 ~ 10)/off>'
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
            if (!args[1]) return this.client.ui.usage(message, 'crystalize <intensity:int(-10 ~ 10)/off>');

            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'crystalize', false);
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Crystalize** Off');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Crystalize');
                }
            } else {
                const intensity = parseFloat(args[1]);

                if (intensity < -10 || intensity > 10 || isNaN(intensity)) {
                    return this.client.ui.reply(message, 'error', 'Intensity must be between **-10** to **10**, or **"off"**.');
                }

                await this.client.player.setFilter(message.guild.id, 'crystalize', `crystalizer=i=${intensity}`);
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Crystalize** Intensity \`${intensity}\``);
            }
        } else {
            if (vc.id !== currentVc.channel.id) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
