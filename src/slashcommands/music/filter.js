const { SlashCommand, CommandOptionType } = require('slash-create');

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
                            value: 'asetrate'
                        },
                        {
                            name: 'reverse',
                            value: 'reverse'
                        },
                        {
                            name: 'crystalize',
                            value: 'crystalize'
                        },
                        {
                            name: 'customfilter',
                            value: 'customfilter'
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
                    description: 'Adjust the bass in decibels.',
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
                        type: CommandOptionType.NUMBER,
                        name: 'depth',
                        description: 'The depth of the tremolo effect.',
                        min_value: 0,
                        max_value: 1,
                        required: true
                    },
                    {
                        type: CommandOptionType.INTEGER,
                        name: 'frequency',
                        description: 'The frequency of the tremolo effect.',
                        min_value: 1
                    }
                ]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'vibrato',
                description: 'Adds a vibrato effect to the player.',
                options: [
                    {
                        type: CommandOptionType.NUMBER,
                        name: 'depth',
                        description: 'The depth of the vibrato effect.',
                        min_value: 0,
                        max_value: 1,
                        required: true
                    },
                    {
                        type: CommandOptionType.INTEGER,
                        name: 'frequency',
                        description: 'The frequency of the vibrato effect.',
                        min_value: 1
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
                    type: CommandOptionType.INTEGER,
                    name: 'rate',
                    description: 'The rate of speed.',
                    min_value: 0.1,
                    max_value: 10,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'pitch',
                description: 'Changes the pitch of the playing track.',
                options: [{
                    type: CommandOptionType.INTEGER,
                    name: 'rate',
                    description: 'The rate of high or low vibrations.',
                    min_value: 0.1,
                    max_value: 10,
                    required: true
                }]
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'crystalize',
                description: 'Sharpens or softens the audio quality.',
                options: [{
                    type: CommandOptionType.INTEGER,
                    name: 'intensity',
                    description: 'The intensity of the audio quality.',
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
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(['MANAGE_CHANNELS']);

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
                try {
                    await this.client.player.setFilter(guild.id,
                        ctx.options.remove.filter === 'all'
                            ? false
                            : ctx.options.remove.filter
                        , ctx.options.remove.filter === 'all'
                            ? null
                            : false);
                    return this.client.ui.ctx(ctx, 'info', ctx.options.remove.filter === 'all'
                        ? 'Removed all filters from the player.'
                        : `**${ctx.options.remove.filter.charAt(0).toUpperCase() + ctx.options.remove.filter.slice(1)}** Off`);
                } catch {
                    return noFilter(ctx.options.remove.filter.charAt(0).toUpperCase() + ctx.options.remove.filter.slice(1));
                }
            }

            case 'bass': {
                await this.client.player.setFilter(guild.id, 'bassboost', `bass=g=${ctx.options.bass.db}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Bass Boost** ${ctx.options.bass.db === 0
                    ? 'Off'
                    : `Gain: \`${ctx.options.bass.db}dB\``
                }`);
            }

            case 'tremolo': {
                const f = ctx.options.tremolo.frequency ?? 5;
                const d = ctx.options.tremolo.depth;
                console.log(f + d);
                await this.client.player.setFilter(guild.id, 'tremolo', `tremolo=f=${f}:d=${d}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Tremolo** ${d === 0 && !f
                    ? 'Off'
                    : `Depth \`${d}\` at \`${f}Hz\``
                }`);
            }

            case 'vibrato': {
                const f = ctx.options.vibrato.frequency ?? 5;
                const d = ctx.options.vibrato.depth;
                await this.client.player.setFilter(guild.id, 'vibrato', `vibrato=f=${f}:d=${d}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Vibrato** ${d === 0 && !f
                    ? 'Off'
                    : `Depth \`${d}\` at \`${f}Hz\``
                }`);
            }

            case 'reverse': {
                const reverse = ctx.options.reverse.toggle;
                await this.client.player.setFilter(guild.id, 'reverse', reverse
                    ? 'areverse'
                    : false
                );
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Reverse** ${reverse
                    ? 'On'
                    : 'Off'
                }`);
            }

            case 'tempo': {
                const rate = ctx.options.tempo.rate;
                await this.client.player.setFilter(guild.id, 'tempo', `rubberband=tempo=${rate}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Tempo** Rate: \`${rate}\``);
            }

            case 'pitch': {
                const rate = ctx.options.pitch.rate;
                await this.client.player.setFilter(guild.id, 'pitch', `rubberband=pitch=${rate}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Pitch** Rate: \`${rate}\``);
            }

            case 'crystalize': {
                const intensity = ctx.options.crystalize.intensity;
                await this.client.player.setFilter(guild.id, 'crystalize', `crystalizer=i=${intensity}`);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Crystalize** Intensity \`${intensity}\``);
            }

            case 'customfilter': {
                const custom = ctx.options.customfilter.filter;
                await this.client.player.setFilter(guild.id, 'custom', custom);
                return this.client.ui.ctxCustom(ctx, '📢', process.env.COLOR_INFO, `**Custom Filter** Argument: \`${custom}\``);
            }
            }
        } else {
            if (vc.id !== currentVc.channel.id) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
}

module.exports = CommandFilter;
