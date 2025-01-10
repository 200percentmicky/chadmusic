/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2025  Micky | 200percentmicky
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

const { SlashCommand, ApplicationCommandType } = require('slash-create');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');
const ytdl = require('@distube/ytdl-core');

class ContextMenuAddToQueue extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'Add to queue',
            type: ApplicationCommandType.MESSAGE
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.user.id);

        const djMode = this.client.settings.get(ctx.guildID, 'djMode');
        const djRole = this.client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        // if (!text && !message.attachments.first()) return client.ui.usage(message, 'play <url/search/attachment>');

        if (!dj) {
            const list = await this.client.settings.get(guild.id, 'blockedPhrases');
            const splitSearch = ctx.targetMessage.content.split(/ +/g);
            for (let i = 0; i < splitSearch.length; i++) {
                /* eslint-disable-next-line no-useless-escape */
                if (list.includes(splitSearch[i].replace(/(^\\<+|\\>+$)/g, ''))) {
                    await ctx.defer(true);
                    return this.client.ui.reply(ctx, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
                }
            }
        }

        await ctx.defer();

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            try {
                this.client.vc.join(vc);
            } catch (err) {
                const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                if (!permissions) return this.client.ui.sendPrompt(ctx, 'MISSING_CONNECT', vc.id);
                else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.sendPrompt(ctx, 'FULL_CHANNEL');
                else return this.client.ui.reply(ctx, 'error', `An error occured connecting to the voice channel. ${err.message}`);
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
        } else {
            if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === _member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.reply(ctx, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            let requested;

            if (ctx.targetMessage.embeds[0]) {
                const embed = ctx.targetMessage.embeds;
                requested = embed[0].url ?? embed[0].title ?? embed[0].description;
            } else {
                requested = ctx.targetMessage.content ?? undefined;
            }

            if (!requested) {
                return this.client.ui.reply(ctx, 'warn', 'The message doesn\'t contain any content to search for.');
            }

            if (ytdl.validateURL(requested.replace(/(^\\<+|\\>+$)/g, ''))) {
                if (!this.client.settings.get('global', 'allowYouTube')) {
                    return this.client.ui.sendPrompt(ctx, 'YT_NOT_ALLOWED');
                }
            }

            this.client.utils.createAgent(this.client);

            /* eslint-disable-next-line no-useless-escape */
            await this.client.player.play(vc, requested.replace(/(^\\<+|\\>+$)/g, ''), {
                textChannel: channel,
                member: _member,
                metadata: {
                    ctx
                }
            });
        } catch (err) {
            this.client.logger.error(err.stack); // Just in case.
            return this.client.ui.reply(ctx, 'error', err.message, 'Player Error');
        }
    }
}

module.exports = ContextMenuAddToQueue;
