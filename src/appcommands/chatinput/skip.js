/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

const { SlashCommand, CommandOptionType } = require('slash-create');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

class CommandSkip extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'skip',
            description: 'Skips the playing track.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'track',
                    description: 'Skips the playing track, or vote to skip if the voice channel has more than 3 people.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'force',
                    description: 'Force skips the currently playing track.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'jump',
                    description: 'Skips the track to a specified entry in the queue.',
                    options: [
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'index',
                            description: 'The entry in the queue to skip to.',
                            min_value: 1,
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.user.id);

        const djMode = this.client.settings.get(guild.id, 'djMode');
        const djRole = this.client.settings.get(guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild);

        const currentVc = this.client.vc.get(vc);
        if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

        switch (ctx.subcommands[0]) {
        case 'force': {
            if (dj || vc.members.size <= 2) {
                if (!queue.songs[1]) {
                    this.client.player.stop(guild);
                    this.client.ui.custom(ctx, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
                }
                this.client.player.skip(guild);
                await this.client.ui.custom(ctx, '⏭', process.env.COLOR_INFO, 'Skipping...');
            } else {
                this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }

            channel.sendTyping();
            break;
        }

        case 'jump': {
            const song = queue.songs[ctx.options.jump.index];

            if (dj || vc.members.size <= 2) {
                try {
                    this.client.player.jump(guild, parseInt(ctx.options.jump.index));
                    await this.client.ui.custom(ctx, '⏭', process.env.COLOR_INFO, `Skipping to ${
                        song.metadata?.silent
                            ? 'a hidden track'
                            : `**${song.name}**`
                    }...`);
                    return channel.sendTyping();
                } catch {
                    return this.client.ui.reply(ctx, 'error', 'Not a valid entry in the queue.');
                }
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        default: { // track
            if (vc.members.size >= 4) {
                const vcSize = Math.floor(vc.members.size / 2);
                const neededVotes = queue.votes.length >= vcSize;
                const votesLeft = Math.floor(vcSize - queue.votes.length);
                if (queue.votes.includes(member.user.id)) return this.client.ui.reply(ctx, 'warn', 'You already voted to skip.');
                queue.votes.push(member.user.id);
                if (neededVotes) {
                    queue.votes = [];
                    if (!queue.songs[1]) {
                        this.client.player.stop(guild);
                        return this.client.ui.custom(ctx, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
                    }
                    this.client.player.skip(guild);
                    await this.client.ui.custom(ctx, '⏭', process.env.COLOR_INFO, 'Skipping...');
                    return channel.sendTyping();
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(parseInt(process.env.COLOR_INFO))
                        .setDescription('⏭ Skipping?')
                        .setFooter({
                            text: `${votesLeft} more vote${votesLeft === 1 ? '' : 's'} needed to skip.${dj ? " Yo DJ, you can force skip the track by using '/skip force'." : ''}`,
                            icon_url: member.user.avatarURL({ dynamic: true })
                        });
                    return ctx.send({ embeds: [embed] });
                }
            } else {
                queue.votes = [];
                if (!queue.songs[1]) {
                    this.client.player.stop(guild);
                    return this.client.ui.custom(ctx, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
                }
                this.client.player.skip(guild);
                await this.client.ui.custom(ctx, '⏭', process.env.COLOR_INFO, 'Skipping...');
                return channel.sendTyping();
            }
        }
        }
    }
}

module.exports = CommandSkip;
