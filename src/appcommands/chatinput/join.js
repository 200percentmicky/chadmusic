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

const { SlashCommand } = require('slash-create');
const { ChannelType, PermissionsBitField } = require('discord.js');
const CMError = require('../../lib/CMError');
const { useQueue, useMainPlayer } = require('discord-player');

class CommandStop extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'join',
            description: 'Summons the bot to the voice channel.'
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        if (ctx.channel.type === ChannelType.DM) {
            throw new CMError('NO_DMS_ALLOWED');
        }

        const settings = this.client.settings.get(ctx.guildID);

        const client = this.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const member = await guild.members.fetch(ctx.user.id);

        const djMode = client.settings.get(ctx.guildID, 'djMode');
        const dj = await this.client.utils.isDJ(channel, member);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const vc = member.voice.channel;
        const textChannel = client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', vc.id);
            }
        }

        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        const player = useMainPlayer();
        const queue = useQueue(guild.id);

        if (!vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect)) {
            return this.client.ui.sendPrompt(ctx, 'MISSING_CONNECT', vc.id);
        }

        if (vc.members.size === vc.userLimit) {
            if (vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.MoveMembers)) {} // eslint-disable-line no-empty, brace-style
            else {
                return this.client.ui.sendPrompt(ctx, 'FULL_CHANNEL');
            }
        }

        if (!queue) {
            try {
                player.nodes.create(guild, {
                    metadata: {
                        textChannel: channel
                    },
                    nodeOptions: {
                        volume: parseInt(settings.defaultVolume),
                        leaveOnStop: settings.leaveOnStop,
                        leaveOnEnd: settings.leaveOnFinish,
                        leaveOnEmpty: settings.leaveOnEmpty,
                        leaveOnEmptyCooldown: parseInt(settings.emptyCooldown)
                    }
                }).connect(vc);
            } catch (err) {
                return this.client.ui.reply(ctx, 'error', `An error occured connecting to the voice channel. ${err.message}`);
            }

            if (vc.type === 'stage') {
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    try {
                        await guild.members.me.voice.setRequestToSpeak(true);
                    } catch {
                        await guild.members.me.voice.setSuppressed(false);
                    }
                } else {
                    await guild.members.me.voice.setSuppressed(false);
                }
            }
            return this.client.ui.custom(ctx, ':inbox_tray:', 0x77B255, `Joined <#${vc.id}>`);
        } else {
            if (vc.id !== queue.channel?.id) return this.client.ui.reply(ctx, 'error', 'I\'m currently binded to a different voice channel.');
            else return this.client.ui.reply(ctx, 'info', 'I\'m already in a voice channel. Let\'s get this party started!');
        }
    }
}

module.exports = CommandStop;
