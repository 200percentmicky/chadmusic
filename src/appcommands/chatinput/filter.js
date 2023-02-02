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

const { SlashCommand, CommandOptionType } = require('slash-create');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

class CommandFilter extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'filter',
            description: 'Add a filter to the player.',
            options: [{
                type: CommandOptionType.SUB_COMMAND,
                name: 'remove',
                description: 'Remove some or all filters active on the player.',
                options: [{
                    type: CommandOptionType.STRING,
                    name: 'filter',
                    description: 'The filter to remove from the player.',
                    required: true,
                    choices: [
                        {
                            name: 'bass',
                            value: 'bassboost'
                        },
                        {
                            name: 'vibrato',
                            value: 'vibrato'
                        },
                        {
                            name: 'tremolo',
                            value: 'tremolo'
                        },
                        {
                            name: 'tempo',
                            value: 'tempo'
                        },
                        {
                            name: 'pitch',
                            value: 'pitch'
                        },
                        {
                            name: 'reverse',
                            value: 'reverse'
                        },
                        {
                            name: 'crusher',
                            value: 'crusher'
                        },
                        {
                            name: 'crystalize',
                            value: 'crystalize'
                        },
                        {
                            name: 'customfilter',
                            value: 'custom'
                        },
                        {
                            name: 'all',
                            value: 'all'
                        }
                    ]
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'bass',
                description: 'Boosts the bass of the player.',
                options: [{
                    type: CommandOptionType.INTEGER,
                    name: 'db',
                    description: 'Adjust the bass in decibels. 0 to disable.',
                    min_value: 0,
                    max_value: 100,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'tremolo',
                description: 'Adds a tremolo effect to the player.',
                options: [
                    {
                        type: CommandOptionType.INTEGER,
                        name: 'frequency',
                        description: 'The frequency of the tremolo effect. 0 to disable Tremolo.',
                        min_value: 0,
                        required: true
                    },
                    {
                        type: CommandOptionType.NUMBER,
                        name: 'depth',
                        description: 'The depth of the tremolo effect.',
                        min_value: 0,
                        max_value: 1
                    }
                ]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'vibrato',
                description: 'Adds a vibrato effect to the player.',
                options: [
                    {
                        type: CommandOptionType.INTEGER,
                        name: 'frequency',
                        description: 'The frequency of the vibrato effect. 0 to disable Vibrato.',
                        min_value: 0,
                        required: true
                    },
                    {
                        type: CommandOptionType.NUMBER,
                        name: 'depth',
                        description: 'The depth of the vibrato effect.',
                        min_value: 0,
                        max_value: 1
                    }
                ]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'reverse',
                description: 'Plays the track in reverse.',
                options: [
                    {
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'The toggle to enable or disable reverse.',
                        required: true
                    }
                ]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'tempo',
                description: 'Changes the tempo of the playing track.',
                options: [{
                    type: CommandOptionType.NUMBER,
                    name: 'rate',
                    description: 'The rate of speed. 0 to disable.',
                    min_value: 0,
                    max_value: 10,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'pitch',
                description: 'Changes the pitch of the playing track.',
                options: [{
                    type: CommandOptionType.NUMBER,
                    name: 'rate',
                    description: 'The rate of high or low vibrations. 0 to disable.',
                    min_value: 0,
                    max_value: 10,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'crusher',
                description: 'Crushes the audio without changing the bit depth. Makes it sound more harsh and "digital".',
                options: [
                    {
                        type: CommandOptionType.NUMBER,
                        name: 'samples',
                        description: 'The sample reduction. 0 to disable.',
                        min_value: 0,
                        max_value: 250,
                        required: true
                    },
                    {
                        type: CommandOptionType.NUMBER,
                        name: 'bits',
                        description: 'The bit reduction. Default is 8.',
                        min_value: 1,
                        max_value: 64
                    },
                    {
                        type: CommandOptionType.STRING,
                        name: 'mode',
                        description: 'Changes logarithmic mode to either linear or logarithmic. Default is linear.',
                        choices: [
                            {
                                name: 'linear',
                                value: 'lin'
                            },
                            {
                                name: 'logarithmic',
                                value: 'log'
                            }
                        ]
                    }
                ]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'crystalize',
                description: 'Sharpens or softens the audio quality.',
                options: [{
                    type: CommandOptionType.INTEGER,
                    name: 'intensity',
                    description: 'The intensity of the audio quality. 0 to disable.',
                    min_value: -10,
                    max_value: 10,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'customfilter',
                description: '[Owner Only] Adds a custom FFMPEG audio filter.',
                options: [{
                    type: CommandOptionType.STRING,
                    name: 'filter',
                    description: 'The custom filter to add. Playback will error if the filter is not a valid FFMPEG audio filter.',
                    required: true
                }]
            }]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.user.id);

        const djMode = this.client.settings.get(ctx.guildID, 'djMode');
        const djRole = this.client.settings.get(ctx.guildID, 'djRole');
        const allowFilters = this.client.settings.get(ctx.guildID, 'allowFilters');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);

        if (djMode && !dj) return this.client.ui.send(ctx, 'DJ_MODE');

        if (!allowFilters && !dj) return this.client.ui.send(ctx, 'FILTERS_NOT_ALLOWED');

        const vc = member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild.id);
        if (!queue) return this.client.ui.send(ctx, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            const noFilter = (filter) => {
                return this.client.ui.send(
                    ctx,
                    'FILTER_NOT_APPLIED',
                    filter
                );
            };

            switch (ctx.subcommands[0]) {
            case 'remove': {
                const filterNames = {
                    bassboost: 'Bass Boost',
                    vibrato: 'Vibrato',
                    tremolo: 'Tremolo',
                    pitch: 'Pitch',
                    tempo: 'Tempo',
                    reverse: 'Reverse',
                    crusher: 'Crusher',
                    crystalize: 'Crystalize',
                    custom: 'Custom Filter',
                    all: 'All'
                };

                try {
                    // TODO: Change to use FilterManager.clear() instead.
                    if (ctx.options.remove.filter === 'all') {
                        try {
                            await queue.filters.clear();
                            pushFormatFilter(queue, 'All');
                            return this.client.ui.reply(ctx, 'info', 'Removed all filters from the player.');
                        } catch {
                            return this.client.ui.reply(ctx, 'warn', 'No filters are currently applied to the player.');
                        }
                    } else {
                        await queue.filters.set(ctx.options.remove.filter, null);
                        pushFormatFilter(queue, filterNames[ctx.options.remove.filter], 'Off');
                        return this.client.ui.reply(ctx, 'info', ctx.options.remove.filter === 'all'
                            ? 'Removed all filters from the player.'
                            : `**${filterNames[ctx.options.remove.filter]}** Off`);
                    }
                } catch {
                    return noFilter(filterNames[ctx.options.remove.filter]);
                }
            }

            case 'bass': {
                try {
                    await queue.filters.set('bassboost', ctx.options.bass.db !== 0 ? `bass=g=${ctx.options.bass.db}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Bass Boost');
                }
                pushFormatFilter(queue, 'Bass Boost', ctx.options.bass.db !== 0 ? `Gain: \`${ctx.options.bass.db}dB\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, `**Bass Boost** ${ctx.options.bass.db === 0
                    ? 'Off'
                    : `Gain: \`${ctx.options.bass.db}dB\``
                }`);
            }

            case 'tremolo': {
                const f = ctx.options.tremolo.frequency ?? 5;
                const d = ctx.options.tremolo.depth ?? 1;
                try {
                    await queue.filters.set('tremolo', f !== 0 ? `tremolo=f=${f}:d=${d}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Tremolo');
                }
                pushFormatFilter(queue, 'Tremolo', f !== 0 ? `Depth \`${d}\` at \`${f}Hz\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, `**Tremolo** ${f === 0
                    ? 'Off'
                    : `Depth \`${d}\` at \`${f}Hz\``
                }`);
            }

            case 'vibrato': {
                const f = ctx.options.vibrato.frequency ?? 5;
                const d = ctx.options.vibrato.depth ?? 1;
                try {
                    await queue.filters.set('vibrato', f !== 0 ? `vibrato=f=${f}:d=${d}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Vibrato');
                }
                pushFormatFilter(queue, 'Vibrato', f !== 0 ? `Depth \`${d}\` at \`${f}Hz\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, `**Vibrato** ${f === 0
                    ? 'Off'
                    : `Depth \`${d}\` at \`${f}Hz\``
                }`);
            }

            case 'reverse': {
                const reverse = ctx.options.reverse.toggle;
                try {
                    await queue.filters.set('reverse', reverse
                        ? 'areverse'
                        : false
                    );
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Reverse');
                }
                pushFormatFilter(queue, 'Reverse', reverse ? 'Enabled' : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, `**Reverse** ${reverse
                    ? 'On'
                    : 'Off'
                }`);
            }

            case 'tempo': {
                const rate = ctx.options.tempo.rate;
                try {
                    await queue.filters.set('tempo', rate !== 0 ? `rubberband=tempo=${rate}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Tempo');
                }
                pushFormatFilter(queue, 'Tempo', rate !== 0 ? `Rate: \`${rate}\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, rate !== 0 ? `**Tempo** Rate: \`${rate}\`` : '**Tempo** Off');
            }

            case 'pitch': {
                const rate = ctx.options.pitch.rate;
                try {
                    await queue.filters.set('pitch', rate !== 0 ? `rubberband=pitch=${rate}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Pitch');
                }
                pushFormatFilter(queue, 'Pitch', rate !== 0 ? `Rate: \`${rate}\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, rate !== 0 ? `**Pitch** Rate: \`${rate}\`` : '**Pitch** Off');
            }

            case 'crusher': {
                const samples = ctx.options.crusher.samples;
                const bits = ctx.options.crusher.bits || 8;
                const mode = ctx.options.crusher.mode || 'lin';
                try {
                    await queue.filters.set('crusher', samples !== 0 ? `acrusher=samples=${samples}:bits=${bits}:mode=${mode}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Crusher');
                }
                pushFormatFilter(queue, 'Crusher', samples !== 0 ? `Sample size \`${samples}\` at \`${bits}\` bits. Mode: ${mode}` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, samples !== 0 ? `**Crusher** Sample size \`${samples}\` at \`${bits}\` bits. Mode: ${mode}` : '**Crusher** Off');
            }

            case 'crystalize': {
                const intensity = ctx.options.crystalize.intensity;
                try {
                    await queue.filters.set('crystalize', intensity !== 0 ? `crystalizer=i=${intensity}` : false);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Crystalize');
                }
                pushFormatFilter(queue, 'Crystalize', intensity !== 0 ? `Intensity \`${intensity}\`` : 'Off');
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, intensity !== 0 ? `**Crystalize** Intensity \`${intensity}\`` : '**Crystalize** Off');
            }

            case 'customfilter': {
                const custom = ctx.options.customfilter.filter;
                try {
                    await queue.filters.set('custom', custom === 'OFF'.toLowerCase() ? false : custom);
                } catch {
                    return this.client.ui.send(ctx, 'FILTER_NOT_APPLIED', 'Custom Filter');
                }
                pushFormatFilter(queue, 'Custom Filter', custom === 'OFF'.toLowerCase() ? 'Off' : custom);
                return this.client.ui.custom(ctx, '📢', process.env.COLOR_INFO, custom === 'OFF'.toLowerCase() ? '**Custom Filter** Off' : `**Custom Filter** Argument: \`${custom}\``);
            }
            }
        } else {
            if (!isSameVoiceChannel(this.client, member, vc)) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
}

module.exports = CommandFilter;
