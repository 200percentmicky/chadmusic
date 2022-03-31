const { Command } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class CommandDisconnect extends Command {
    constructor () {
        super('disconnect', {
            aliases: ['disconnect', 'leave', 'pissoff', 'fuckoff'],
            category: '🎶 Music',
            description: {
                text: 'Disconnects from the current voice channel.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        const currentVc = this.client.vc.get(message.member.voice.channel);
        if (!currentVc) {
            return this.client.ui.reply(message, 'error', 'I\'m not in any voice channel.');
        }

        if (!vc) {
            return this.client.ui.send(message, 'NOT_IN_VC');
        } else if (vc.id !== currentVc.channel.id) {
            return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (vc.members.size <= 2 || dj) {
            if (this.client.player.getQueue(message)) {
                this.client.player.stop(message);
            }
            this.client.vc.leave(message);
            return this.client.ui.custom(message, '📤', 0xDD2E44, `Left <#${vc.id}>`);
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
