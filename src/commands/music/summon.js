/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandSummon extends Command {
    constructor () {
        super('summon', {
            aliases: ['summon', 'join'],
            category: '🎶 Music',
            description: {
                text: 'Summons the bot to a voice channel.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (vc.id !== currentVc.id) return this.client.ui.reply(message, 'error', 'I\'m currently binded to a different voice channel.');
            else return this.client.ui.reply(message, 'info', 'I\'m already in a voice channel. Let\'s get this party started!');
        } else {
            try {
                this.client.vc.join(vc);
            } catch (err) {
                const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                if (!permissions) return this.client.ui.sendPrompt(message, 'MISSING_CONNECT', vc.id);
                else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.sendPrompt(message, 'FULL_CHANNEL');
                else return this.client.ui.reply(message, 'error', `An error occured connecting to the voice channel. ${err.message}`);
            }

            if (vc.type === 'stage') {
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    try {
                        await message.guild.members.me.voice.setRequestToSpeak(true);
                    } catch {
                        await message.guild.members.me.voice.setSuppressed(false);
                    }
                } else {
                    await message.guild.members.me.voice.setSuppressed(false);
                }
            }
            return this.client.ui.custom(message, ':inbox_tray:', 0x77B255, `Joined <#${vc.id}>`);
        }
    }
};
