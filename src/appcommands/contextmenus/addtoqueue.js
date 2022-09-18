/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { SlashCommand, ApplicationCommandType } = require('slash-create');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

class ContextMenuAddToQueue extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'Add To Queue',
            type: ApplicationCommandType.MESSAGE
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const djMode = this.client.settings.get(ctx.guildID, 'djMode');
        const djRole = this.client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.ctx(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        // if (!text && !message.attachments.first()) return client.ui.usage(message, 'play <url/search/attachment>');

        if (!dj) {
            const list = await this.client.settings.get(guild.id, 'blockedPhrases');
            const splitSearch = ctx.targetMessage.content.split(/ +/g);
            for (let i = 0; i < splitSearch.length; i++) {
                /* eslint-disable-next-line no-useless-escape */
                if (list.includes(splitSearch[i].replace(/(^\\<+|\\>+$)/g, ''))) {
                    await ctx.defer(true);
                    return this.client.ui.ctx(ctx, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
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
                if (!permissions) return this.client.ui.send(ctx, 'MISSING_CONNECT', vc.id);
                else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.send(ctx, 'FULL_CHANNEL');
                else return this.client.ui.ctx(ctx, 'error', `An error occured connecting to the voice channel. ${err.message}`);
            }

            if (vc.type === 'stage') {
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.RequestToSpeak);
                    if (!requestToSpeak) {
                        this.client.vc.leave(guild);
                        return this.client.ui.send(ctx, 'MISSING_SPEAK', vc.id);
                    } else if (guild.members.me.voice.suppress) {
                        await guild.members.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await guild.members.me.voice.setSuppressed(false);
                }
            }
        } else {
            if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === _member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.ctx(ctx, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            const requested = ctx.targetMessage.content;

            if (!requested) return this.client.ui.ctx(ctx, 'error', 'Cannot add to the queue because the message doesn\'t contain any content to search for.');

            /* eslint-disable-next-line no-useless-escape */
            await this.client.player.play(vc, requested.replace(/(^\\<+|\\>+$)/g, ''), {
                textChannel: channel,
                member: _member
            });
            return this.client.ui.ctxCustom(ctx, process.env.EMOJI_MUSIC, process.env.COLOR_MUSIC, `Searching \`${requested}\``);
        } catch (err) {
            this.client.logger.error(err.stack); // Just in case.
            return this.client.ui.ctx(ctx, 'error', `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error');
        }
    }
}

module.exports = ContextMenuAddToQueue;
