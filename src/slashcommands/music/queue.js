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

const { SlashCommand, ComponentType, TextInputStyle, CommandOptionType } = require('slash-create');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const { Paginator } = require('array-paginator');
const { toColonNotation } = require('colon-notation');

class CommandQueue extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'queue',
            description: 'Shows the player\'s current queue on this server.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'current',
                    description: "Shows the player's current queue on this server."
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'reverse',
                    description: 'Reverses the order of the queue.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'shuffle',
                    description: 'Randomly shuffles the order of the queue.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'remove',
                    description: 'Remove a song, or multiple songs from the queue.',
                    options: [
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'index_or_start',
                            description: 'The song to remove or the beginning position to remove multiple songs.',
                            required: true
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'end',
                            description: 'The end position to remove multiple songs. All songs from start to end will be removed.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'clear',
                    description: "Clears the player's queue on this server."
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.member.id);

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

        const queue = this.client.player.getQueue(guild);
        const vc = member.voice.channel;

        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(guild) || !currentVc) return this.client.ui.send(ctx, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

        switch (ctx.subcommands[0]) {
        case 'reverse': {
            if (vc.members.size <= 2 || dj) {
                const queue = this.client.player.getQueue(guild);

                /* Slice the original queue */
                const queueLength = queue.songs.length;
                const newQueue = queue.songs.slice(1, queueLength);

                /* Remove the existing elements in the queue */
                queue.songs.splice(1, queueLength);

                /* Reverse the new queue */
                newQueue.reverse();

                /* Finally, push the new queue into the player's queue. */
                Array.prototype.push.apply(queue.songs, newQueue);

                this.client.ui.ctx(ctx, 'ok', 'The order of the queue has been reversed.');
            } else {
                this.client.ui.send(ctx, 'NOT_ALONE');
            }

            break;
        }

        case 'shuffle': {
            if (vc.members.size <= 2 || dj) {
                this.client.player.shuffle(guild);
                this.client.ui.ctx(ctx, 'ok', `**${queue.songs.length - 1}** entries have been shuffled.`);
            } else {
                this.client.ui.send(ctx, 'NOT_ALONE');
            }

            break;
        }

        case 'remove': {
            if (vc.members.size <= 2 || dj) {
                /* Remove multiple entries from the queue. */
                if (ctx.options.remove.end) {
                    /* Parsing arguments as numbers */
                    const start = parseInt(ctx.options.remove.index_or_start);
                    const end = parseInt(ctx.options.remove.end);

                    /* Slice original array to get the length. */
                    const n = parseInt(queue.songs.slice(start, end).length + 1);

                    /* Modify queue to remove the entries. */
                    queue.songs.splice(start, n);

                    this.client.ui.ctx(ctx, 'ok', `Removed **${n}** entries from the queue.`);
                } else {
                    /* Removing only one entry from the queue. */
                    const song = queue.songs[ctx.options.remove.index_or_start];

                    /* Modify queue to remove the specified entry. */
                    queue.songs.splice(ctx.options.remove.index_or_start, 1);

                    this.client.ui.ctx(ctx, 'ok', `Removed **${song.name}** from the queue.`);
                }
            } else {
                this.client.ui.send(ctx, 'NOT_ALONE');
            }

            break;
        }

        case 'clear': {
            if (vc.members.size <= 2 || dj) {
                // Clear everything from the queue.
                queue.songs.splice(1, queue.songs.length);
                this.client.ui.ctxCustom(ctx, '💥', 0xDF6C3B, '**BOOM!** Cleared the queue.');
            } else {
                this.client.ui.send(ctx, 'NOT_ALONE');
            }

            break;
        }

        default: { // current
            await ctx.defer();

            /* Getting the entire queue. */
            const songs = queue.songs.slice(1);
            const song = queue.songs[0];

            /* Create a paginated array. */
            const queuePaginate = new Paginator(songs, 10);

            /* Get the page of the array. */
            const paginateArray = queuePaginate.page(1);

            // This includes the currently playing song btw...
            const numOfEntries = songs.length > 0 ? `${songs.length} entr${queue.songs.length === 1 ? 'y' : 'ies'}` : '';
            const trueTime = songs.map(x => x.duration).reduce((a, b) => a + b, 0);
            const totalTime = songs.length > 0 ? ` • Total Length: \`${trueTime ? toColonNotation(parseInt(trueTime + '000')) : '00:00'}\`` : '';

            /* Map the array. */
            const queueMap = songs.length > 0
                ? paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n')
                : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs!`;

            /* Making the embed. */
            const queueEmbed = new MessageEmbed()
                .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
                .setAuthor({
                    name: `Queue for ${guild.name} - ${currentVc.channel.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`)
                .addField(`${process.env.EMOJI_MUSIC} Currently Playing`, `**[${song.name}](${song.url})**\n${song.user} \`${song.formattedDuration}\``)
                .setTimestamp()
                .setFooter({
                    text: `${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });

            /* Creating the buttons to interact with the queue. */

            // First Page
            const firstPage = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(process.env.FIRST_PAGE)
                .setCustomId('qc_first_page')
                .setDisabled(true); // Since the embed opens on the first page.

            // Previous Page
            const previousPage = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(process.env.PREVIOUS_PAGE)
                .setCustomId('qc_previous_page')
                .setDisabled(true); // Since the embed opens on the first page.

            // Next Page
            const nextPage = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(process.env.NEXT_PAGE)
                .setCustomId('qc_next_page');

            // Last Page
            const lastPage = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(process.env.LAST_PAGE)
                .setCustomId('qc_last_page');

            // Jump to Page
            const pageJump = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(process.env.JUMP_PAGE)
                .setCustomId('qc_page_jump');

            // Cancel
            const cancelButton = new MessageButton()
                .setStyle('DANGER')
                .setEmoji(process.env.CLOSE)
                .setCustomId('qc_cancel_button');

            /* Row of buttons! */
            const buttonRow = new MessageActionRow()
                .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

            /* Ran out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
                .addComponents(cancelButton);

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

            /* Finally send the embed of the queue. */
            await ctx.send({ embeds: [queueEmbed], components: components });

            // TODO: Look into combining the collector into a single function.

            // First Page Button
            ctx.registerComponent('qc_first_page', async (btnCtx) => {
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

                const paginateArray = queuePaginate.first();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Enable and disable buttons */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                if (!queuePaginate.hasPrevious()) {
                    firstPage.setDisabled(true);
                    previousPage.setDisabled(true);
                }
                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Ran out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });
                await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }, 300 * 1000);

            // Previous Page Button
            ctx.registerComponent('qc_previous_page', async (btnCtx) => {
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

                const paginateArray = queuePaginate.previous();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Need to make sure all buttons are available */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasPrevious()) {
                    firstPage.setDisabled(true);
                    previousPage.setDisabled(true);
                }
                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Ran out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });
                await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }, 300 * 1000);

            // Next Page Button
            ctx.registerComponent('qc_next_page', async (btnCtx) => {
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

                const paginateArray = queuePaginate.next();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Need to make sure all buttons are available */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasNext()) {
                    nextPage.setDisabled(true);
                    lastPage.setDisabled(true);
                }

                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Ran out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });
                await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }, 300 * 1000);

            // Last Page Button
            ctx.registerComponent('qc_last_page', async (btnCtx) => {
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

                const paginateArray = queuePaginate.last();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Enable and disable buttons */
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasNext()) {
                    nextPage.setDisabled(true);
                    lastPage.setDisabled(true);
                }

                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Ran out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });
                await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }, 300 * 1000);

            // Jump to Page Button
            ctx.registerComponent('qc_page_jump', async (btnCtx) => {
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

                await btnCtx.sendModal({
                    title: 'Select Page',
                    components: [
                        {
                            type: ComponentType.ACTION_ROW,
                            components: [{
                                type: ComponentType.TEXT_INPUT,
                                custom_id: 'qc_new_page',
                                style: TextInputStyle.SHORT,
                                required: true,
                                max_length: 3,
                                label: 'Which page do you want to jump to?'
                            }]
                        }
                    ]
                }, async (modalCtx) => {
                    let pageNumber = parseInt(modalCtx.values.qc_new_page);

                    if (isNaN(pageNumber)) {
                        return modalCtx.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(parseInt(process.env.COLOR_ERROR))
                                    .setDescription(`${process.env.EMOJI_ERROR} A number must be provided in your response. Please try again.`)
                            ],
                            ephemeral: true
                        });
                    }

                    if (pageNumber <= 0) pageNumber = 1; // Pagination works with negative values wtf

                    if (pageNumber >= queuePaginate.total) {
                        const paginateArray = queuePaginate.last();

                        /* Map the array. */
                        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                        nextPage.setDisabled(false);
                        lastPage.setDisabled(false);
                        firstPage.setDisabled(false);
                        previousPage.setDisabled(false);

                        if (!queuePaginate.hasNext()) {
                            nextPage.setDisabled(true);
                            lastPage.setDisabled(true);
                        }
                        /* Row of buttons! */
                        const buttonRow = new MessageActionRow()
                            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                        /* Ran out of room for the cancel button, so... */
                        const cancelRow = new MessageActionRow()
                            .addComponents(cancelButton);

                        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                        /* Making the embed. */
                        queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                        queueEmbed.setFooter({
                            text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                            iconURL: member.user.avatarURL({ dynamic: true })
                        });
                        await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                    } else if (pageNumber <= queuePaginate.total) {
                        const paginateArray = queuePaginate.first();

                        /* Map the array. */
                        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                        nextPage.setDisabled(false);
                        lastPage.setDisabled(false);
                        firstPage.setDisabled(false);
                        previousPage.setDisabled(false);

                        if (!queuePaginate.hasPrevious()) {
                            firstPage.setDisabled(true);
                            previousPage.setDisabled(true);
                        }

                        /* Row of buttons! */
                        const buttonRow = new MessageActionRow()
                            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                        /* Ran out of room for the cancel button, so... */
                        const cancelRow = new MessageActionRow()
                            .addComponents(cancelButton);

                        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                        /* Making the embed. */
                        queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                        queueEmbed.setFooter({
                            text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                            iconURL: member.user.avatarURL({ dynamic: true })
                        });
                        await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                    }

                    const paginateArray = queuePaginate.page(pageNumber);
                    /* Map the array. */
                    const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                    nextPage.setDisabled(false);
                    lastPage.setDisabled(false);
                    firstPage.setDisabled(false);
                    previousPage.setDisabled(false);

                    if (!queuePaginate.hasPrevious()) {
                        firstPage.setDisabled(true);
                        previousPage.setDisabled(true);
                    } else if (!queuePaginate.hasNext()) {
                        nextPage.setDisabled(true);
                        lastPage.setDisabled(true);
                    }

                    /* Row of buttons! */
                    const buttonRow = new MessageActionRow()
                        .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                    /* Ran out of room for the cancel button, so... */
                    const cancelRow = new MessageActionRow()
                        .addComponents(cancelButton);

                    const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                    /* Making the embed. */
                    queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                    queueEmbed.setFooter({
                        text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                        iconURL: member.user.avatarURL({ dynamic: true })
                    });
                    await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                });
            });

            // Cancel Button
            ctx.registerComponent('qc_cancel_button', async (btnCtx) => {
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

                btnCtx.acknowledge();
                btnCtx.delete();
            });
        }
        }
    }
}

module.exports = CommandQueue;
