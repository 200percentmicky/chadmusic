/// ChadMusic
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

const { stripIndents } = require('common-tags');
const { SlashCommand, CommandOptionType, ChannelType } = require('slash-create');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { toColonNotation, toMilliseconds } = require('colon-notation');
const { version } = require('../../../package.json');
const { request } = require('undici');
const CMError = require('../../lib/CMError');

// TODO: Look into condensing all changes into a single method.
// A majority of this command is nothing but copying and pasting
// the same thing because I'm lazy as shit... oh well... ¯\_(ツ)_/¯

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
                    name: 'thumbnailsize',
                    description: "Changes the track's thumbnail size of the \"Now Playing\" embeds.",
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'size',
                        description: 'The size of the track\'s image.',
                        required: true,
                        choices: [
                            {
                                name: 'Small',
                                value: 'small'
                            },
                            {
                                name: 'Large',
                                value: 'large'
                            }
                        ]
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
                        description: 'The text channel to use.'
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'blocksong',
                    description: "Manages the server's list of blocked search phrases.",
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'add',
                            description: "Adds a phrase to the server's list.",
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to add to the list',
                                required: true
                            }]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'remove',
                            description: 'Removes a phrase from the list.',
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to remove from the list.',
                                required: true
                            }]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'list',
                            description: 'Lists all blocked phrases on this server.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'prefix',
                    description: "Changes the bot's prefix for this server.",
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'newprefix',
                            description: "The prefix to use for the server. Only applies to the bot's message based commands.",
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowsilent',
                    description: 'Toggles the ability to silently add tracks to the queue.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'Enables or disables the feature.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'leaveonempty',
                    description: 'Toggles whether the bot should leave when the voice channel is empty for a period of time.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'Enables or disables the feature.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'leaveonfinish',
                    description: 'Toggles whether the bot should leave when the end of the queue has been reached.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'Enables or disables the feature.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'leaveonstop',
                    description: 'Toggles whether the bot should leave when the player is stopped.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'Enables or disables the feature.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'emptycooldown',
                    description: 'Sets how long the bots stays in an empty voice channel.',
                    options: [
                        {
                            type: CommandOptionType.NUMBER,
                            name: 'time',
                            description: 'The time the bot will stay in seconds.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'voteratio',
                    description: 'Changes the vote-skip ratio requirement for placing votes to skip a track.',
                    options: [
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'percentage',
                            description: 'The ratio to set as a percentage. Set to 0 to disable, or 100 to require everyone to vote.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'songvcstatus',
                    description: 'Toggles whether the bot will set the playing track\'s title as a status for the voice channel.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'The toggle of the setting.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'emitsongadd',
                    description: 'Toggles the ability to send a message when a track is added to the queue.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'toggle',
                            description: 'The toggle of the setting.',
                            required: true,
                            choices: [
                                {
                                    name: 'Enabled',
                                    value: 'true'
                                },
                                {
                                    name: 'Disabled',
                                    value: ''
                                },
                                {
                                    name: '[Default] Enabled, but no message is sent when a player is created.',
                                    value: 'nocreate'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'global',
                    description: "[Owner Only] Manages the bot's global settings.",
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'current',
                            description: 'Shows the bot\'s current global settings.'
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'export',
                            description: 'Export all settings data to a file.'
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'import',
                            description: 'Import all settings data from a file.',
                            options: [
                                {
                                    type: CommandOptionType.ATTACHMENT,
                                    name: 'file',
                                    description: 'The settings file to import.',
                                    required: true
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'shownewsongonly',
                            description: 'Toggles whether the Now Playing alerts are shown for new songs only.',
                            options: [
                                {
                                    type: CommandOptionType.BOOLEAN,
                                    name: 'toggle',
                                    description: 'Enables or disables the feature.',
                                    required: true
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'allowyoutube',
                            description: 'Toggles the ability to allow tracks from YouTube to be added to the player.',
                            options: [
                                {
                                    type: CommandOptionType.BOOLEAN,
                                    name: 'toggle',
                                    description: 'Enables or disables the feature.',
                                    required: true
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'streamtype',
                            description: 'Selects which audio encoder the bot should use during streams.',
                            options: [
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'encoder',
                                    description: 'The audio encoder to use.',
                                    required: true,
                                    choices: [
                                        {
                                            name: 'Opus (Better quality, uses more resources.)',
                                            value: 'opus'
                                        },
                                        {
                                            name: 'RAW (Better performance, uses less resources.)',
                                            value: 'raw'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        if (ctx.channel.type === ChannelType.DM) {
            throw new CMError('NO_DMS_ALLOWED');
        }

        const settings = this.creator.client.settings;
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const member = await guild.members.fetch(ctx.user.id);

        await settings.ensure(ctx.guildID, this.client.defaultSettings);
        await settings.ensure('global', this.client.defaultGlobalSettings);

        // Global Settings
        const emitNewSongOnly = settings.get('global', 'emitNewSongOnly'); // Show New Song Only
        const streamType = settings.get('global', 'streamType'); // Audio Encoder
        const allowYouTube = settings.get('global', 'allowYouTube'); // Allow YouTube

        const encoderType = {
            0: 'Opus',
            1: 'RAW'
        };

        // Server Settings
        const prefix = settings.get(guild.id, 'prefix'); // Prefix
        const djRole = settings.get(guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(guild.id, 'allowLinks'); // Allow Links
        const allowSilent = settings.get(guild.id, 'allowSilent'); // Allow Silent Tracks
        const defaultVolume = settings.get(guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(guild.id, 'textChannel'); // Text Channel
        const blockedPhrases = settings.get(guild.id, 'blockedPhrases'); // Blocked Songs
        const thumbnailSize = settings.get(guild.id, 'thumbnailSize'); // Thumbnail Size
        const votingPercent = settings.get(guild.id, 'votingPercent'); // Voting Percentage
        const leaveOnEmpty = settings.get(guild.id, 'leaveOnEmpty'); // Leave on Empty
        const leaveOnFinish = settings.get(guild.id, 'leaveOnFinish'); // Leave on Finish
        const leaveOnStop = settings.get(guild.id, 'leaveOnStop'); // Leave on Stop
        const emptyCooldown = settings.get(guild.id, 'emptyCooldown'); // Empty Cooldown
        const songVcStatus = settings.get(guild.id, 'songVcStatus'); // Track Title as VC Status
        const emitSongAddAlert = settings.get(guild.id, 'emitSongAddAlert'); // Emit Song Add Message

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        if (ctx.subcommands[0] === 'global') {
            if (ctx.user.id !== this.client.ownerID) {
                return this.client.ui.sendPrompt(ctx, 'OWNER_ONLY');
            }

            switch (ctx.subcommands[1]) {
            case 'shownewsongonly': {
                const toggle = ctx.options.global.shownewsongonly.toggle;

                await settings.set('global', toggle, 'emitNewSongOnly');
                this.client.player.options.emitNewSongOnly = toggle;
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? 'Now Playing alerts will now only show for new songs.'
                    : 'Now Playing alerts will now show for every song.'
                );
                break;
            }

            case 'allowyoutube': {
                const toggle = ctx.options.global.allowyoutube.toggle;

                await settings.set('global', toggle, 'allowYouTube');
                this.client.player.options.emitNewSongOnly = toggle;
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? 'Enabled YouTube support.'
                    : 'Disabled YouTube support.'
                );
                break;
            }

            case 'streamtype': {
                const encoderType = {
                    opus: 0,
                    raw: 1
                };

                const encoder = ctx.options.global.streamtype.encoder;

                this.client.player.options.streamType = encoderType[encoder];
                this.client.ui.reply(ctx, 'ok', `Audio encoder has been set to **${encoder}**.`);
                break;
            }

            case 'export': {
                await ctx.defer(true);

                const exportData = this.client.settings.export();
                const buffer = Buffer.from(exportData);
                const timestamp = new Date();

                try {
                    await ctx.send({ files: [{ file: buffer, name: `settings-export_${timestamp}.json` }] });
                } catch (err) {
                    await ctx.send(`${process.env.EMOJI_ERROR} Unable to create export file. ${err}`);
                }
                break;
            }

            case 'import': {
                await ctx.defer(true);

                const file = ctx.attachments.first().url;
                const response = await request(file);
                const importData = await response.body.text();

                try {
                    this.client.settings.import(importData, true, true);
                } catch (err) {
                    return ctx.send({ content: `${process.env.EMOJI_ERROR} Unable to import settings file. ${err}` });
                }

                await ctx.send({ content: `${process.env.EMOJI_OK} Settings imported successfully.` });

                break;
            }

            default: { // current
                const embed = new EmbedBuilder()
                    .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                    .setAuthor({
                        name: `ChadMusic v${version}`,
                        iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                    })
                    .setTitle(':globe_with_meridians: Global Settings')
                    .setDescription(stripIndents`
                        **Audio Encoder:** ${encoderType[streamType]}
                        **Show New Song Only:** ${emitNewSongOnly === true ? 'On' : 'Off'}
                        **Allow YouTube:** ${allowYouTube === true ? 'Yes' : 'No'}
                        `
                    )
                    .setTimestamp();

                return ctx.send({ embeds: [embed] });
            }
            }
        } else {
            if (!channel.permissionsFor(ctx.user.id).has(PermissionsBitField.Flags.ManageGuild)) {
                const djRole = this.client.settings.get(ctx.guildID, 'djRole');
                const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);

                if (dj && ctx.subcommands[0] === 'djmode') {} // eslint-disable-line no-empty, brace-style
                else return this.client.ui.sendPrompt(ctx, 'MISSING_PERMISSIONS', 'Manage Guild');
            }

            const queue = this.client.player.getQueue(guild);

            switch (ctx.subcommands[0]) {
            case 'current': {
                const embed = new EmbedBuilder()
                    .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                    .setAuthor({
                        name: `${guild.name}`,
                        iconURL: guild.iconURL({ dynamic: true })
                    })
                    .setTitle(':gear: Settings')
                    .addFields({
                        name: ':notes: Player',
                        value: stripIndents`
                        **:interrobang: Prefix:** \`${prefix}\`
                        **:bookmark: DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
                        **:microphone: DJ Mode:** ${djMode === true ? 'On' : 'Off'}
                        **:frame_photo: Thumbnail Size:** ${thumbnailSize === 'large' ? 'Large' : 'Small'}
                        **:loud_sound: Default Volume:** ${defaultVolume}
                        **:hash: Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
                        **:mailbox_with_no_mail: Leave On Empty:** ${leaveOnEmpty === true ? 'On' : 'Off'}
                        **:checkered_flag: Leave On Finish:** ${leaveOnFinish === true ? 'On' : 'Off'}
                        **:stop_sign: Leave On Stop:** ${leaveOnStop === true ? 'On' : 'Off'}
                        **:hourglass_flowing_sand: Empty Cooldown:** ${parseInt(emptyCooldown)} seconds
                        **:speech_balloon: Track Title as VC Status:** ${songVcStatus === true ? 'On' : 'Off'}
                        **:speech_left: Emit Song Add Message:** ${emitSongAddAlert !== false ? emitSongAddAlert === 'nocreate' ? 'On (New player excluded)' : 'On' : 'Off'}
                        `
                    },
                    {
                        name: ':shield: Moderation',
                        value: stripIndents`
                        **:timer: Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
                        **:1234: Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
                        **:loudspeaker: Allow Filters:** ${allowFilters ? 'Yes' : 'No'}
                        **:joy: Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
                        **:link: Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
                        **:underage: Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
                        **:shushing_face: Allow Silent Tracks:** ${allowSilent === true ? 'Yes' : 'No'}
                        **:raised_hand: Vote-skip Percentage:** ${parseFloat(votingPercent) * 100}%
                        `
                    })
                    .setTimestamp()
                    .setFooter({
                        text: `ChadMusic v${version}`,
                        iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                    });

                return ctx.send({ embeds: [embed] });
            }

            case 'remove': {
                await settings.set(ctx.guildID, this.client.defaultSettings[ctx.options.remove.setting], ctx.options.remove.setting);
                return this.client.ui.reply(ctx, 'ok', `**${ctx.options.remove.setting}** has been reverted to the default setting.`);
            }

            case 'djrole': {
                await ctx.defer();

                const role = await guild.roles.fetch(ctx.options.djrole.role);

                const setDjRole = async (role) => {
                    await this.client.settings.set(guild.id, role.id, 'djRole');
                    return this.client.ui.reply(ctx, 'ok', `<@&${role.id}> has been set as the DJ Role.`);
                };

                if (role.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                    const yesButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Yes')
                        .setEmoji('✔')
                        .setCustomId('yes_dj_role');

                    const noButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('No')
                        .setEmoji('✖')
                        .setCustomId('no_dj_role');

                    const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

                    await this.client.ui.reply(
                        ctx,
                        'info',
                        stripIndents`
                        The role you selected is already recognized as a DJ role on this server.
                        This is because the role has the **Manage Channels** permission which
                        automatically grants DJ permissions for members with this role. Do you
                        still want to set this role as the DJ role on this server?`,
                        null,
                        null,
                        null,
                        [buttonRow]
                    );

                    ctx.registerComponent('yes_dj_role', async (btnCtx) => {
                        if (ctx.user.id !== btnCtx.user.id) return this.client.ui.reply(btnCtx, 'no', 'That component can only be used by the user that ran this command.', null, null, true);
                        await setDjRole(role);

                        btnCtx.acknowledge();
                        btnCtx.delete();
                    }, 60 * 1000);

                    ctx.registerComponent('no_dj_role', async (btnCtx) => {
                        if (ctx.user.id !== btnCtx.user.id) return this.client.ui.reply(btnCtx, 'no', 'That component can only be used by the user that ran this command.', null, null, true);

                        btnCtx.acknowledge();
                        btnCtx.delete();
                    }, 60 * 1000);
                } else {
                    await setDjRole(role);
                }
                break;
            }

            case 'djmode': {
                await settings.set(ctx.guildID, ctx.options.djmode.toggle, 'djMode');
                return this.client.ui.reply(ctx, 'ok', 'DJ Mode has been enabled.');
            }

            case 'maxtime': {
                const time = toMilliseconds(ctx.options.maxtime.time);
                if (isNaN(time)) return this.client.ui.reply(ctx, 'error', `\`${ctx.options.maxtime.time}\` doesn't parse to a time format. The format must be \`xx:xx\`.`);
                await settings.set(ctx.guildID, time, 'maxTime');
                return this.client.ui.reply(ctx, 'ok', `Max Time has been set to \`${ctx.options.maxtime.time}\``);
            }

            case 'maxqueuelimit': {
                await settings.set(ctx.guildID, ctx.options.maxqueuelimit.limit, 'maxQueueLimit');
                return this.client.ui.reply(ctx, 'ok', `Max Queue Limits have been set to \`${ctx.options.maxqueuelimit.limit}\`.`);
            }

            case 'allowfilters': {
                await settings.set(ctx.guildID, ctx.options.allowfilters.toggle, 'allowFilters');
                return this.client.ui.reply(ctx, 'ok', `Filters have been ${ctx.options.allowfilters.toggle ? '**enabled**.' : '**disabled**. Only DJs will be able to apply filters.'}`);
            }

            case 'allowexplicit': {
                await settings.set(ctx.guildID, ctx.options.allowexplicit.toggle, 'allowFilters');
                return this.client.ui.reply(ctx, 'ok', `Age restricted content is ${ctx.options.allowexplicit.toggle ? 'now allowed' : 'no longer allowed'} on this server.`);
            }

            case 'allowlinks': {
                await settings.set(ctx.guildID, ctx.options.allowlinks.toggle, 'allowLinks');
                return this.client.ui.reply(ctx, 'ok', `URLs can ${ctx.options.allowlinks.toggle ? 'now' : 'no longer'} be added to the queue.`);
            }

            case 'unlimitedvolume': {
                await settings.set(ctx.guildID, ctx.options.unlimitedvolume.toggle, 'allowFreeVolume');
                return this.client.ui.reply(ctx, 'ok', `Unlimited Volume has been ${ctx.options.unlimitedvolume.toggle ? '**enabled**.' : '**disabled**. Volume has been limited to 200%.'}`);
            }

            case 'thumbnailsize': {
                await settings.set(ctx.guildID, ctx.options.thumbnailsize.size, 'thumbnailSize');
                return this.client.ui.reply(ctx, 'ok', `Thumbnail size has been set to **${ctx.options.thumbnailsize.size}**.`);
            }

            case 'defaultvolume': {
                await settings.set(ctx.guildID, ctx.options.defaultvolume.volume, 'defaultVolume');
                return this.client.ui.reply(ctx, 'ok', `Default volume for the player has been set to **${ctx.options.defaultvolume.volume}%**.`);
            }

            case 'allowsilent': {
                await settings.set(ctx.guildID, ctx.options.allowsilent.toggle, 'allowSilent');
                return this.client.ui.reply(ctx, 'ok', `Silent tracks have been **${ctx.options.allowsilent.toggle === true ? 'enabled' : 'disabled'}**.`);
            }

            case 'blocksong': {
                await ctx.defer(true);

                switch (ctx.subcommands[1]) {
                case 'add': {
                    if (settings.includes(guild.id, ctx.options.blocksong.add.phrase, 'blockedPhrases')) {
                        return this.client.ui.reply(ctx, 'warn', `\`${ctx.options.blocksong.add.phrase}\` already exists in the list.`);
                    }
                    await settings.push(guild.id, ctx.options.blocksong.add.phrase, 'blockedPhrases');
                    return this.client.ui.reply(ctx, 'ok', `\`${ctx.options.blocksong.add.phrase}\` is now blocked on this server.`, null, 'Any phrases in the list will no longer be added to the player.');
                }

                case 'remove': {
                    if (!settings.includes(guild.id, ctx.options.blocksong.remove.phrase, 'blockedPhrases')) {
                        return this.client.ui.reply(ctx, 'warn', `\`${ctx.options.blocksong.remove.phrase}\` doesn't exists in the list.`);
                    }
                    await settings.remove(guild.id, ctx.options.blocksong.remove.phrase, 'blockedPhrases');
                    return this.client.ui.reply(ctx, 'ok', `\`${ctx.options.blocksong.remove.phrase}\` is no longer blocked on this server.`);
                }

                case 'list': {
                    const blockedEmbed = new EmbedBuilder()
                        .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                        .setAuthor({
                            name: `${guild.name}`,
                            iconURL: guild.iconURL({ dynamic: true })
                        })
                        .setTitle(':notes::x: Blocked Songs')
                        .setDescription(`\`\`\`${blockedPhrases.join(', ')}\`\`\``)
                        .setTimestamp()
                        .setFooter({
                            text: `ChadMusic v${version}`,
                            iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                        });

                    if (blockedPhrases.length === 0) {
                        blockedEmbed.setDescription(null);
                        blockedEmbed.addFields({
                            name: `${process.env.EMOJI_INFO} No phrases are being blocked in this server.`,
                            value: 'To add phrases to the list, run `/settings blocksong add <phrase>`.'
                        });
                    }

                    return ctx.send({ embeds: [blockedEmbed] });
                }
                }
                break;
            }

            case 'textchannel': {
                await settings.set(ctx.guildID, ctx.options.textchannel.channel ?? null, 'textChannel');
                return this.client.ui.reply(ctx, 'ok', `${`<#${ctx.options.textchannel.channel}>` ?? 'All text channels'}> will be used for music commands.`);
            }

            // Message based commands only.
            case 'prefix': {
                await settings.set(guild.id, ctx.options.prefix.newprefix, 'prefix');
                return this.client.ui.reply(ctx, 'ok', `The prefix has been set to \`${ctx.options.prefix.newprefix}\``);
            }

            case 'emptycooldown': {
                const time = ctx.options.emptycooldown.time;

                await settings.set(guild.id, time, 'emptyCooldown');
                if (queue) queue.emptyCooldown = time;
                this.client.ui.reply(ctx, 'ok', `Empty Cooldown has been set to \`${parseInt(time)}\` seconds.`);
                break;
            }

            case 'leaveonempty': {
                const toggle = ctx.options.leaveonempty.toggle;

                await settings.set(guild.id, toggle, 'leaveOnEmpty');
                if (queue) queue.leaveOnEmpty = toggle;
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? `I'll leave the voice channel when the channel is empty for a period of time. **Empty Cooldown** is ${emptyCooldown === (0 || undefined) ? `not set. Run \`${prefix}emptycooldown\` to set it.` : `set to \`${emptyCooldown}\``}`
                    : 'I\'ll stay in the voice channel when the channel becomes empty.'
                );
                break;
            }

            case 'leaveonfinish': {
                const toggle = ctx.options.leaveonfinish.toggle;

                await settings.set(guild.id, toggle, 'leaveOnFinish');
                if (queue) queue.leaveOnFinish = toggle;
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? 'I\'ll leave the voice channel when the queue finishes.'
                    : 'I\'ll stay in the voice channel when the queue finishes.'
                );
                break;
            }

            case 'leaveonstop': {
                const toggle = ctx.options.leaveonstop.toggle;

                await settings.set(guild.id, toggle, 'leaveOnStop');
                if (queue) queue.leaveOnStop = toggle;
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? 'I\'ll leave the voice channel when the player is stopped.'
                    : 'I\'ll stay in the voice channel when the player is stopped.'
                );
                break;
            }

            case 'voteratio': {
                const newPercentage = parseFloat(ctx.options.voteratio.percentage) / 100;
                await settings.set(guild.id, newPercentage, 'votingPercent');
                this.client.ui.reply(ctx, 'ok', `Vote-skip ratio is set to **${ctx.options.voteratio.percentage}%**.`);
                break;
            }

            case 'songvcstatus': {
                const toggle = ctx.options.songvcstatus.toggle;
                await this.client.settings.set(guild.id, toggle, 'songVcStatus');
                this.client.ui.reply(ctx, 'ok', toggle === true
                    ? 'The bot will now set currently playing tracks as a voice channel status.'
                    : 'The bot will no longer set a voice channel status.'
                );
                break;
            }

            case 'emitsongadd': {
                const toggle = ctx.options.emitsongadd.toggle;
                await this.client.settings.set(guild.id, toggle !== 'nocreate' ? !!toggle : toggle, 'emitSongAddAlert');

                if (toggle === 'nocreate') {
                    this.client.ui.reply(ctx, 'ok', 'Enabled song add messages.', null, 'No message will be sent when a player is created.');
                } else {
                    this.client.ui.reply(ctx, 'ok', `${toggle === true ? 'Enabled' : 'Disabled'} song add messages.`);
                }
            }
            }
        }
    }
};
