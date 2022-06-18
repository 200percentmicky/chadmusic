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

const { SlashCommand, CommandOptionType, ComponentType, ButtonStyle } = require('slash-create');
const {
    MessageEmbed,
    Permissions
} = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

class CommandSearch extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'search',
            description: 'Searches for a track.',
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'query',
                    description: 'The track to search for. Provides the first 10 results.',
                    required: true
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const member = guild.members.cache.get(ctx.user.id);
        const channel = guild.channels.cache.get(ctx.channelID);

        const djMode = this.client.settings.get(guild.id, 'djMode');
        const djRole = this.client.settings.get(guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const list = await this.client.settings.get(guild.id, 'blockedPhrases');
        const splitSearch = ctx.options.query.split(/ +/g);
        if (list.length > 0) {
            if (!dj) {
                for (let i = 0; i < splitSearch.length; i++) {
                    if (list.includes(splitSearch[i])) {
                        await ctx.defer(true);
                        return this.client.ui.ctx(ctx, 'no', 'Unable to search for your selection because your search contains a blocked phrase on this server.');
                    }
                }
            }
        }

        const vc = member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT']);
            if (!permissions) return this.client.ui.send(ctx, 'MISSING_CONNECT', vc.id);

            if (vc.type === 'stage') {
                await this.client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
                const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK']);
                    if (!requestToSpeak) {
                        vc.leave();
                        return this.client.ui.send(ctx, 'MISSING_SPEAK', vc.id);
                    } else if (guild.me.voice.suppress) {
                        await guild.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await guild.me.voice.setSuppressed(false);
                }
            } else {
                this.client.vc.join(vc);
            }
        } else {
            if (!isSameVoiceChannel(this.client, member, vc)) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.maxQueueLimit.get(guild.id);
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        this.client.ui.reply(ctx, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        await ctx.defer();

        const results = await this.client.player.search(ctx.options.query);

        const emojiNumber = {
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
            10: '🔟'
        };

        const resultsFormattedList = results.map(x => `**${emojiNumber[results.indexOf(x) + 1]}** \`${x.formattedDuration}\` ${x.name}`).join('\n\n');

        const embed = new MessageEmbed()
            .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
            .setAuthor({
                name: 'Which track do you wanna play?',
                iconURL: member.user.avatarURL({ dynamic: true })
            })
            .setDescription(`${resultsFormattedList}`)
            .setFooter({
                text: 'Make your selection using the menu below.'
            });

        const menuOptions = [];
        let i;
        for (i = 0; i < results.length; i++) {
            const track = {
                label: results[i].name,
                description: `${results[i].formattedDuration} • ${results[i].uploader.name}`,
                value: `${i}`,
                emoji: {
                    // eslint-disable-next-line no-useless-escape
                    name: emojiNumber[i + 1]
                }
            };
            menuOptions.push(track);
        }

        await ctx.send({
            embeds: [embed],
            components: [
                {
                    type: ComponentType.ACTION_ROW,
                    components: [{
                        type: ComponentType.SELECT,
                        custom_id: 'track_menu',
                        placeholder: 'Pick a track!',
                        options: menuOptions
                    }]
                },
                {
                    type: ComponentType.ACTION_ROW,
                    components: [{
                        type: ComponentType.BUTTON,
                        style: ButtonStyle.DESTRUCTIVE,
                        custom_id: 'cancel_search',
                        emoji: { name: process.env.CLOSE }
                    }]
                }
            ]
        });

        ctx.registerComponent(
            'track_menu',
            async (selCtx) => {
                if (ctx.user.id !== selCtx.user.id) {
                    return selCtx.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(parseInt(process.env.COLOR_NO))
                                .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                        ],
                        ephemeral: true
                    });
                }

                await this.client.player.play(vc, results[parseInt(selCtx.values[0])].url, {
                    member: member,
                    textChannel: channel
                });
                return ctx.delete();
            },
            30 * 1000
        );

        ctx.registerComponent(
            'cancel_search',
            async (btnCtx) => {
                if (ctx.user.id !== btnCtx.user.id) {
                    return btnCtx.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(parseInt(process.env.COLOR_NO))
                                .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                        ],
                        ephemeral: true
                    });
                }

                return ctx.delete();
            },
            30 * 1000
        );
    }
}

module.exports = CommandSearch;
