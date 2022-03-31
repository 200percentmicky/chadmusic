const { Command } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class CommandSummon extends Command {
    constructor () {
        super('summon', {
            aliases: ['summon', 'join'],
            category: '🎶 Music',
            description: {
                text: 'Summons the bot to a voice channel.'
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

        const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT']);
        if (!permissions) return this.client.ui.send(message, 'MISSING_CONNECT', vc.id);

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (vc.id !== currentVc.id) return this.client.ui.reply(message, 'error', 'I\'m currently binded to a different voice channel.');
            else return this.client.ui.reply(message, 'info', 'I\'m already in a voice channel. Let\'s get this party started!');
        } else {
            if (vc.type === 'stage') {
                await this.client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
                this.client.ui.custom(message, '📥', 0x77B255, `Joined \`${vc.name}\``);
                const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK']);
                    if (!requestToSpeak) {
                        vc.leave();
                        return this.client.ui.send(message, 'MISSING_SPEAK', vc.id);
                    } else if (message.guild.me.voice.suppress) {
                        await message.guild.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await message.guild.me.voice.setSuppressed(false);
                }
            } else {
                this.client.vc.join(vc);
            }
            return this.client.ui.custom(message, '📥', 0x77B255, `Joined <#${vc.id}>`);
        }
    }
};
