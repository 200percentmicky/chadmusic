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

const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');
const humanTime = require('human-interval');

class CommandMod extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'mod',
            description: 'Various moderation commands for the server.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'clean',
                    description: 'Deletes a number of messages from a channel.',
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'messages',
                            description: 'Number of messages to delete that are newer than two weeks.',
                            options: [
                                {
                                    type: CommandOptionType.INTEGER,
                                    name: 'messages',
                                    description: 'The number of messages to delete.',
                                    min_value: 1,
                                    max_value: 100,
                                    required: true
                                },
                                {
                                    type: CommandOptionType.USER,
                                    name: 'member',
                                    description: 'If provided, only deletes messages from that member.'
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'embeds',
                            description: 'Delete messages from a channel that contain embeds only.',
                            options: [
                                {
                                    type: CommandOptionType.INTEGER,
                                    name: 'messages',
                                    description: 'The number of messages to delete.',
                                    min_value: 1,
                                    max_value: 100,
                                    required: true
                                },
                                {
                                    type: CommandOptionType.USER,
                                    name: 'member',
                                    description: 'If provided, only deletes messages from that member.'
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'links',
                            description: 'Whether to focus on deleting links. Defaults to false.',
                            options: [
                                {
                                    type: CommandOptionType.INTEGER,
                                    name: 'messages',
                                    description: 'The number of messages to delete.',
                                    min_value: 1,
                                    max_value: 100,
                                    required: true
                                },
                                {
                                    type: CommandOptionType.USER,
                                    name: 'member',
                                    description: 'If provided, only deletes messages from that member.'
                                }
                            ]

                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'ban',
                    description: 'Bans a member from the server.',
                    options: [
                        {
                            type: CommandOptionType.USER,
                            name: 'member',
                            description: 'The member to ban.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'reason',
                            description: 'The reason for the ban.',
                            required: true
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'days',
                            description: 'Deletes message up to a number of days. Default is 0 days.',
                            min_value: 1,
                            max_value: 7
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'kick',
                    description: 'Kicks a member from the server.',
                    options: [
                        {
                            type: CommandOptionType.USER,
                            name: 'member',
                            description: 'The member to kick.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'reason',
                            description: 'The reason for the kick.',
                            required: true
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'days',
                            description: 'Deletes message up to a number of days. (Require the bot to have the "Ban Members" permission.)',
                            min_value: 1,
                            max_value: 7
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'mute',
                    description: 'Mutes a member. This puts them on timeout.',
                    options: [
                        {
                            type: CommandOptionType.USER,
                            name: 'member',
                            description: 'The member to mute.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'duration',
                            description: 'The duration of the mutes. Supports up to 28 days.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'reason',
                            description: 'The reason for the mute.',
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = await this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.cache.get(ctx.channelID);
        const mod = await guild.members.cache.get(ctx.member.id);

        switch (ctx.subcommands[0]) {
        case 'clean': {
            await ctx.defer(true);
            if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Manage Messages');
            }

            const msgPool = [];
            let collectedMessages;

            switch (ctx.subcommands[1]) {
            case 'messages': {
                collectedMessages = await channel.messages.fetch({ limit: ctx.options.clean.messages.messages });

                if (ctx.options.clean.messages.member) {
                    await collectedMessages.filter(m => m.author.id === ctx.options.clean.messages.member);
                }
                break;
            }
            case 'embeds': {
                collectedMessages = await channel.messages.fetch({ limit: ctx.options.clean.embeds.messages });

                if (ctx.options.clean.embeds.member) {
                    await collectedMessages.filter(m => m.author.id === ctx.options.clean.embeds.member);
                }

                await collectedMessages.sweep(m => m.embeds.length === 0);
                break;
            }
            /* In progress...
            case 'links': {
                collectedMessages = await channel.messages.fetch({ limit: ctx.options.clean.links.messages });
                const linkRegex = /(mailto|news|tel(net)?|urn|ldap|ftp|https?):\+?(\/\/)?\[?([a-zA-Z0-9]\]?.{0,})/gmi;

                if (ctx.options.clean.links.member) {
                    await collectedMessages.filter(m => m.author.id === ctx.options.clean.links.member);
                }

                await collectedMessages.sweep(m => !m.content.match(linkRegex));
                break;
            }
            */
            }

            await collectedMessages.forEach(m => msgPool.push(m));

            try {
                await channel.bulkDelete(msgPool);
            } catch (e) {
                return this.client.ui.ctx(ctx, 'error', e.message);
            }
            return this.client.ui.ctx(ctx, 'ok', `Deleted **${msgPool.length}** messages.`, null, null, true);
        }

        case 'ban': {
            const member = await guild.members.fetch(ctx.options.ban.member);

            if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.BAN_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Ban Members');
            } else if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.BAN_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_CLIENT_PERMISSIONS', 'Ban Members');
            }

            if (!member.bannable) return this.client.ui.ctx(ctx, 'error', `Cannot ban **${member.user.tag}**.`, null, null, true);

            const banDM = new MessageEmbed()
                .setColor('RED')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle('🔨 You have been banned.')
                .setDescription(`**Reason:** ${ctx.options.ban.reason}`);

            const banMessage = new MessageEmbed()
                .setColor('RED')
                .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.avatarURL({ dynamic: true })
                })
                .setTitle('🔨 User has been banned.')
                .setDescription(`**Reason:** ${ctx.options.ban.reason}`);

            try {
                await member.user.send({ embeds: [banDM] });
            } catch {}

            await member.ban({
                days: ctx.options.ban.days ?? 0,
                reason: ctx.options.ban.reason ?? 'No reason provided.' // Just in case.
            });
            await ctx.send({ embeds: [banMessage] });
            return this.client.ui.ctx(ctx, 'ok', `Successfully banned **${member.user.tag}**.`, null, null, true);
        }

        case 'kick': {
            const member = await guild.members.fetch(ctx.options.kick.member);

            if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.KICK_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Kick Members');
            } else if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.KICK_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_CLIENT_PERMISSIONS', 'Kick Members');
            }

            if (!member.kickable) return this.client.ui.ctx(ctx, 'error', `Cannot kick **${member.user.tag}**.`, null, null, true);

            const kickDM = new MessageEmbed()
                .setColor('ORANGE')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle('👢 You have been kicked.')
                .setDescription(`**Reason:** ${ctx.options.kick.reason}`);

            const kickMessage = new MessageEmbed()
                .setColor('ORANGE')
                .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.avatarURL({ dynamic: true })
                })
                .setTitle('👢 User has been kicked.')
                .setDescription(`**Reason:** ${ctx.options.kick.reason}`);

            try {
                await member.user.send({ embeds: [kickDM] });
            } catch {}

            if (ctx.options.kick.days && channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.BAN_MEMBERS)) {
                await member.ban({
                    days: ctx.options.kick.days ?? 0,
                    reason: ctx.options.kick.reason ?? 'No reason provided.' // Just in case.
                });
                await guild.members.unban(ctx.options.kick.member, `Deleting messages up to ${ctx.options.kick.days} day(s) old.`);
            }
            await member.kick({
                reason: ctx.options.kick.reason ?? 'No reason provided.' // Just in case.
            });
            await ctx.send({ embeds: [kickMessage] });
            return this.client.ui.ctx(ctx, 'ok', `Successfully kicked **${member.user.tag}**.`, null, null, true);
        }

        case 'mute': {
            const member = await guild.members.fetch(ctx.options.mute.member);

            if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.MODERATE_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Moderate Members');
            } else if (!channel.permissionsFor(mod.user.id).has(Permissions.FLAGS.MODERATE_MEMBERS)) {
                await ctx.defer(true);
                return this.client.ui.send(ctx, 'MISSING_CLIENT_PERMISSIONS', 'Moderate Members');
            }

            if (isNaN(humanTime(ctx.options.mute.duration))) {
                return this.client.ui.ctx(ctx, 'error', `${ctx.options.mute.duration} is not a valid interval. Be literal with times. For example: \`3 hours, 4 minutes\``);
            }

            // what a name
            if (!member.moderatable) return this.client.ui.ctx(ctx, 'error', `Cannot mute **${member.user.tag}**.`, null, null, true);

            if (member.isCommunicationDisabled()) return this.client.ui.ctx(ctx, 'warn', `**${member.user.tag}** is already muted.`, null, null, true);

            const muteDM = new MessageEmbed()
                .setColor('GREY')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle('🔇 You have been muted.')
                .setDescription(`**Reason:** ${ctx.options.mute.reason}`);

            const muteMessage = new MessageEmbed()
                .setColor('GREY')
                .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.avatarURL({ dynamic: true })
                })
                .setTitle('🔇 User has been muted.')
                .setDescription(`**Reason:** ${ctx.options.mute.reason}`);

            try {
                await member.user.send({ embeds: [muteDM] });
            } catch {}

            await member.timeout(humanTime(ctx.options.mute.duration), ctx.options.mute.reason ?? 'No reason provided.');
            await ctx.send({ embeds: [muteMessage] });
            return this.client.ui.ctx(ctx, 'ok', `Successfully muted **${member.user.tag}** for \`${ctx.options.mute.duration}\`.`, null, null, true);
        }
        }
    }
}

module.exports = CommandMod;
