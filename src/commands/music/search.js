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

const { Command } = require('discord-akairo');
const {
    EmbedBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    PermissionsBitField,
    ButtonStyle,
    Message
} = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { CommandContext } = require('slash-create');

module.exports = class CommandSearch extends Command {
    constructor () {
        super('search', {
            aliases: ['search'],
            category: '🎶 Music',
            description: {
                text: 'Searches for a song on YouTube.',
                usage: '<query>'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'query',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (message instanceof CommandContext) await message.defer();

        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const list = await this.client.settings.get(message.guild.id, 'blockedPhrases');
        const splitSearch = args.query.split(/ +/g);
        if (list.length > 0) {
            if (!dj) {
                for (let i = 0; i < splitSearch.length; i++) {
                    if (list.includes(splitSearch[i])) {
                        return this.client.ui.reply(message, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
                    }
                }
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            try {
                this.client.vc.join(vc);
            } catch (err) {
                const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                if (!permissions) return this.client.ui.send(message, 'MISSING_CONNECT', vc.id);
                else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.send(message, 'FULL_CHANNEL');
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
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(message.guild.id);

        if (!args.query) return this.client.ui.usage(message, 'search <query>');

        if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
        else message.channel.sendTyping();

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(message.guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        const results = await this.client.player.search(args.query);

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

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: 'Which track do you wanna play?',
                iconURL: message.member.user.avatarURL({ dynamic: true })
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

        const menu = new SelectMenuBuilder()
            .setCustomId('track_menu')
            .setPlaceholder('Pick a track!')
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
            await this.client.player.play(vc, results[parseInt(interaction.values[0])].url, {
                member: message.member,
                textChannel: message.channel,
                message: message instanceof Message ? message : undefined,
                metadata: {
                    ctx: message instanceof CommandContext ? message : undefined
                }
            });
            message.react(process.env.EMOJI_MUSIC);
            collector.stop();
        });

        collector.on('end', () => {
            msg.delete();
        });
    }
};
