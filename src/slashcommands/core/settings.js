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

const { stripIndents } = require('common-tags');
const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed, Permissions } = require('discord.js');
const { toColonNotation, toMilliseconds } = require('colon-notation');
const { version } = require('../../../package.json');

module.exports = class CommandSettings extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'settings',
            description: 'Manage the bot\'s settings.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'current',
                    description: 'Shows the current settings for this server.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'remove',
                    description: 'Revert a setting to its default value.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'setting',
                        description: 'The setting you look like to revert.',
                        required: true,
                        choices: [
                            {
                                name: 'djrole',
                                value: 'djRole'
                            },
                            {
                                name: 'djmode',
                                value: 'djMode'
                            },
                            {
                                name: 'maxtime',
                                value: 'maxTime'
                            },
                            {
                                name: 'maxqueuelimit',
                                value: 'maxQueueLimit'
                            },
                            {
                                name: 'allowfilters',
                                value: 'allowFilters'
                            },
                            {
                                name: 'allowexplicit',
                                value: 'allowAgeRestricted'
                            },
                            {
                                name: 'unlimitedvolume',
                                value: 'allowFreeVolume'
                            },
                            {
                                name: 'defaultvolume',
                                value: 'defaultVolume'
                            },
                            {
                                name: 'blockedphrases',
                                value: 'blockedPhrases'
                            },
                            {
                                name: 'textchannel',
                                value: 'textChannel'
                            }
                        ]
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'djrole',
                    description: 'Sets the DJ Role for this server.',
                    options: [{
                        type: CommandOptionType.ROLE,
                        name: 'role',
                        description: 'The role to be recognized as a DJ.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'djmode',
                    description: 'Manages DJ mode on this server.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Toggles DJ Mode for the server.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'maxtime',
                    description: 'Sets the max duration allowed for a song to be added to the queue.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'time',
                        description: 'The duration of the song. This will prevent songs from being added to the queue that exceed this.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'maxqueuelimit',
                    description: 'Sets how many songs a user can add to the queue on this server.',
                    options: [{
                        type: CommandOptionType.INTEGER,
                        name: 'limit',
                        description: 'The max number of songs a user can add to the queue. This will also limit playlists.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowfilters',
                    description: 'Allows or denies the ability to add filters to the player.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Enables or disables the feature. If set to false, only DJs can use filters.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowexplicit',
                    description: 'Allows or denies the ability to add explicit tracks to the queue.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Whether explicit tracks should be added to the queue.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowlinks',
                    description: 'Allows or denies the ability to add songs to the queue from a URL link.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Whether URLs can be added to the queue.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'unlimitedvolume',
                    description: 'Allows or denies the ability to freely set the player\'s volume to any value.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Enables or disables the feature. If set to false, the player\'s volume will be limited to 200%.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'defaultvolume',
                    description: 'Sets the player\'s default volume.',
                    options: [{
                        type: CommandOptionType.INTEGER,
                        name: 'volume',
                        min_value: 1,
                        max_value: 150,
                        description: 'The volume to set when a new player is created.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'textchannel',
                    description: '[Deprecated] Sets the text channel to limit commands to.',
                    options: [{
                        type: CommandOptionType.CHANNEL,
                        name: 'channel',
                        description: 'The text channel to use.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'blocklist',
                    description: "Manages the server's blocklist.",
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'add',
                            description: "Adds a phrase to the server's blocklist.",
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to add to the blocklist',
                                required: true
                            }]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'remove',
                            description: 'Removes a phrase from the blocklist.',
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to remove from the blocklist.',
                                required: true
                            }]
                        }
                    ]
                }
            ]
        });
    }

    async run (ctx) {
        const settings = this.creator.client.settings;
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);

        if (!channel.permissionsFor(ctx.user.id).has(Permissions.FLAGS.MANAGE_GUILD)) {
            return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Manage Server');
        }

        await settings.ensure(ctx.guildID, this.client.defaultSettings);

        // All Settings
        const djRole = settings.get(guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(guild.id, 'allowLinks'); // Allow Links
        const defaultVolume = settings.get(guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(guild.id, 'textChannel'); // Text Channel
        const blockedPhrases = settings.get(guild.id, 'blockedPhrases');
        // const voiceChannel = settings.get(guild.id, 'voiceChannel', null) // Voice Channel

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        switch (ctx.subcommands[0]) {
        case 'current': {
            const embed = new MessageEmbed()
                .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle(':gear: Settings')
                .setDescription(stripIndents`
                **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
                **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
                **⏲ Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
                **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
                **📢 Allow Filters:** ${allowFilters ? 'Yes' : 'No'}
                **😂 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
                **🔗 Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
                **🔞 Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
                **🔊 Default Volume:** ${defaultVolume}
                **#️⃣ Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
                `)
                .setTimestamp()
                .setFooter({
                    text: `ChadMusic v${version}`,
                    iconURL: 'https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });

            const blockedEmbed = new MessageEmbed()
                .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle('🤐 Blocked Phrases')
                .setDescription(`\`\`\`${blockedPhrases.join(', ')}\`\`\``)
                .setTimestamp()
                .setFooter({
                    text: `ChadMusic v${version}`,
                    iconURL: 'https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });

            if (blockedPhrases.length === 0) {
                blockedEmbed.setDescription('');
                blockedEmbed.addField(`${process.env.EMOJI_INFO} Nothing is currently in this server's blocklist.`, 'To add phrases to the blocklist, run `/settings blocklist add <phrase>`.');
            }

            return ctx.send({ embeds: [embed, blockedEmbed] });
        }

        case 'remove': {
            await settings.set(ctx.guildID, this.client.defaultSettings[ctx.options.remove.setting], ctx.options.remove.setting);
            return this.client.ui.ctx(ctx, 'ok', `**${ctx.options.remove.setting}** has been reverted to the default setting.`);
        }

        case 'djrole': {
            await settings.set(ctx.guildID, ctx.options.djrole.role, 'djRole');
            return this.client.ui.ctx(ctx, 'ok', `<@&${ctx.options.djrole.role}> has been set as the DJ role.`);
        }

        case 'djmode': {
            await settings.set(ctx.guildID, ctx.options.djmode.toggle, 'djMode');
            return this.client.ui.ctx(ctx, 'ok', 'DJ Mode has been enabled.');
        }

        case 'maxtime': {
            const time = toMilliseconds(ctx.options.maxtime.time);
            if (isNaN(time)) return this.client.ui.ctx(ctx, 'error', `\`${ctx.options.maxtime.time}\` doesn't parse to a time format. The format must be \`xx:xx\`.`);
            await settings.set(ctx.guildID, time, 'maxTime');
            return this.client.ui.ctx(ctx, 'ok', `Max Time has been set to \`${ctx.options.maxtime.time}\``);
        }

        case 'maxqueuelimit': {
            await settings.set(ctx.guildID, ctx.options.maxqueuelimit.limit, 'maxQueueLimit');
            return this.client.ui.ctx(ctx, 'ok', `Max Queue Limits have been set to \`${ctx.options.maxqueuelimit.limit}\`.`);
        }

        case 'allowfilters': {
            await settings.set(ctx.guildID, ctx.options.allowfilters.toggle, 'allowFilters');
            return this.client.ui.ctx(ctx, 'ok', `Filters have been ${ctx.options.allowfilters.toggle ? '**enabled**.' : '**disabled**. Only DJs will be able to apply filters.'}`);
        }

        case 'allowexplicit': {
            await settings.set(ctx.guildID, ctx.options.allowexplicit.toggle, 'allowFilters');
            return this.client.ui.ctx(ctx, 'ok', `Age restricted content is ${ctx.options.allowexplicit.toggle ? 'now allowed' : 'no longer allowed'} on this server.`);
        }

        case 'allowlinks': {
            await settings.set(ctx.guildID, ctx.options.allowlinks.toggle, 'allowLinks');
            return this.client.ui.ctx(ctx, 'ok', `URLs can ${ctx.options.allowlinks.toggle ? 'now' : 'no longer'} be added to the queue.`);
        }

        case 'unlimitedvolume': {
            await settings.set(ctx.guildID, ctx.options.unlimitedvolume.toggle, 'allowFreeVolume');
            return this.client.ui.ctx(ctx, 'ok', `Unlimited Volume has been ${ctx.options.unlimitedvolume.toggle ? '**enabled**.' : '**disabled**. Volume has been limited to 200%.'}`);
        }

        case 'defaultvolume': {
            await settings.set(ctx.guildID, ctx.options.defaultvolume.volume, 'defaultVolume');
            return this.client.ui.ctx(ctx, 'ok', `Default volume for the player has been set to **${ctx.options.defaultvolume.volume}%**.`);
        }

        case 'blocklist': {
            switch (ctx.subcommands[1]) {
            case 'add': {
                if (this.client.settings.includes(guild.id, ctx.options.blocklist.add.phrase, 'blockedPhrases')) {
                    return this.client.ui.ctx(ctx, 'warn', `\`${ctx.options.blocklist.add.phrase}\` already exists in the blocklist.`);
                }
                await this.client.settings.push(guild.id, ctx.options.blocklist.add.phrase, 'blockedPhrases');
                return this.client.ui.ctx(ctx, 'ok', `\`${ctx.options.blocklist.add.phrase}\` has been added to the blocklist for this server.`, null, 'Any phrases in the blocklist will no longer be added to the queue.');
            }

            case 'remove': {
                if (!this.client.settings.includes(guild.id, ctx.options.blocklist.remove.phrase, 'blockedPhrases')) {
                    return this.client.ui.ctx(ctx, 'warn', `\`${ctx.options.blocklist.remove.phrase}\` doesn't exists in the blocklist.`);
                }
                await this.client.settings.remove(guild.id, ctx.options.blocklist.remove.phrase, 'blockedPhrases');
                return this.client.ui.ctx(ctx, 'ok', `\`${ctx.options.blocklist.remove.phrase}\` has been removed from the blocklist for this server.`);
            }
            }
            break;
        }

        // ! Deprecated.
        // This feature will be replaced when the Command Permissions page is fully
        // implemented into the client.
        // Server Settings -> Integrations -> <Any Application> -> Command Permissions
        case 'textchannel': {
            await settings.set(ctx.guildID, ctx.options.textchannel.channel, 'textChannel');
            return this.client.ui.ctx(ctx, 'ok', `<#${ctx.options.textchannel.channel}> will be used for music commands.`);
        }
        }
    }
};
