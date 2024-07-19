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
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    Message,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const iheart = require('iheart');
const ytdl = require('@distube/ytdl-core');
const { getRandomIPv6 } = require('@distube/ytdl-core/lib/utils');
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');
const { CommandContext } = require('slash-create');

module.exports = class CommandIHeartRadio extends Command {
    constructor () {
        super('iheartradio', {
            aliases: ['iheartradio', 'ihr'],
            category: '🎶 Music',
            description: {
                text: 'Play a iHeartRadio station.',
                usage: '<search>',
                details: '`<search>` The station to search for.'
            },
            channel: 'guild',
            args: [
                {
                    id: 'station',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (message instanceof CommandContext) await message.defer();

        const text = args.station;

        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const dj = await this.client.utils.isDJ(message.channel, message.member);
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

        if (!text) return this.client.ui.usage(message, 'iheartradio <search>');

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
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
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
        else message.channel.sendTyping();

        const queue = this.client.player.getQueue(message.guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(message.guild.id, 'maxQueueLimit');
                const maxTime = await this.client.settings.get(message.guild.id, 'maxTime');

                if (maxTime) {
                    return this.client.ui.reply(message, 'no', 'You can\'t add radio broadcasts to the queue while a max time limit is set on this server.');
                }

                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} track(s) to the queue.`);
                    }
                }
            }
        }

        try {
            const search = await iheart.search(text);
            const stations = search.stations;

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

            const resultsFormattedList = stations.map(x => `**${emojiNumber[stations.indexOf(x) + 1]}** **${x.name}**\n${x.frequency} ${x.band} ${x.callLetters} - ${x.city} ${x.state}`).join('\n\n');

            const embed = new EmbedBuilder()
                .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                .setAuthor({
                    name: 'Which station do you wanna tune to?',
                    iconURL: message.member.user.avatarURL({ dynamic: true })
                })
                .setDescription(`${resultsFormattedList}`)
                .setFooter({
                    text: 'Make your selection using the menu below.'
                });

            const menuOptions = [];
            let i;
            for (i = 0; i < stations.length; i++) {
                const track = new StringSelectMenuOptionBuilder()
                    .setLabel(`${stations[i].name.length > 95
                        ? stations[i].name.substring(0, 92) + '...'
                        : stations[i].name}
                    `)
                    .setDescription(`${stations[i].frequency} ${stations[i].band} ${stations[i].callLetters} - ${stations[i].city} ${stations[i].state}`)
                    .setValue(`${i}`)
                    .setEmoji({
                        name: emojiNumber[i + 1]
                    });

                menuOptions.push(track);
            }

            const menu = new StringSelectMenuBuilder()
                .setCustomId('track_menu')
                .setPlaceholder('Pick a station!')
                .addOptions(menuOptions);

            const cancel = new ButtonBuilder()
                .setCustomId('cancel_search')
                .setStyle(ButtonStyle.Danger)
                .setEmoji(process.env.CLOSE);

            const trackMenu = new ActionRowBuilder()
                .addComponents(menu);

            const cancelButton = new ActionRowBuilder()
                .addComponents(cancel);

            const msg = await message.reply({ embeds: [embed], components: [trackMenu, cancelButton], allowedMentions: { repliedUser: false } });

            const filter = (interaction) => interaction.user.id === message.member.user.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 30 * 1000,
                max: 1
            });

            collector.on('collect', async interaction => {
                if (interaction.customId === 'cancel_search') return collector.stop();
                message.channel.sendTyping();
                const url = await iheart.streamURL(stations[parseInt(interaction.values[0])].id);

                try {
                    this.client.player.youtube.ytdlOptions.agent = process.env.IPV6_BLOCK
                        ? ytdl.createProxyAgent({
                            localAddress: getRandomIPv6(process.env.IPV6_BLOCK)
                        })
                        : this.client.player.youtube.ytdlOptions.agent;

                    await this.client.player.play(vc, url, {
                        member: message.member,
                        textChannel: message.channel,
                        message: message instanceof Message ? message : undefined,
                        metadata: {
                            ctx: message instanceof CommandContext ? message : undefined,
                            isRadio: true,
                            radioStation: stations[parseInt(interaction.values[0])]
                        }
                    });
                } catch (err) {
                    return this.client.ui.reply(message, 'error', err, 'Player Error');
                } finally {
                    message.react(process.env.REACTION_MUSIC).catch(() => {});
                    collector.stop();
                }
            });

            collector.on('end', () => {
                msg.delete();
            });

            return message.react(process.env.REACTION_MUSIC).catch(() => {});
        } catch (err) {
            this.client.logger.error(err.stack); // Just in case.
            return this.client.ui.reply(message, 'error', err, 'Player Error');
        }
    }
};
