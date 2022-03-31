const { SlashCommand, CommandOptionType } = require('slash-create');

class CommandFilter extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'filter',
            description: 'Add a filter to the player.',
            guildIDs: [process.env.DEV_GUILD],
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
                        min_value: 0.1,
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
                        min_value: 0.1,
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
                description: 'Play\'s the track in reverse.'
            },
            {
                type: CommandOptionType.SUB_COMMAND,
                name: 'tempo',
                description: 'Changes the tempo of the playing track.',
                options: [{
                    type: CommandOptionType.INTEGER,
                    name: 'rate',
                    description: 'The rate of speed. Anything lower than 5 will slow down playback.',
                    min_value: 1,
                    max_value: 20,
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

        if (djMode) {
            if (!dj) {
                return this.creator.ui.send(ctx, 'DJ_MODE');
            }
        }

        if (!allowFilters) {
            if (!dj) {
                return this.creator.ui.send(ctx, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = member.voice.channel;
        if (!vc) return this.creator.ui.send(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild.id);
        if (!queue) return this.creator.ui.send(ctx, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            const noFilter = (filter) => {
                return this.creator.ui.send(
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
                    return this.creator.ui.say(ctx, 'info', ctx.options.remove.filter === 'all'
                        ? 'Removed all filters from the player.'
                        : `**${ctx.options.remove.filter.charAt(0).toUpperCase() + ctx.options.remove.filter.slice(1)}** Off`);
                } catch {
                    return noFilter(ctx.options.remove.filter.charAt(0).toUpperCase() + ctx.options.remove.filter.slice(1));
                }
            }

            case 'bass': {
                try {
                    await this.client.player.setFilter(guild.id, 'bassboost', `bass=g=${ctx.options.bass.db}`);
                    return this.creator.ui.custom(ctx, '📢', process.env.COLOR_INFO, `**Bass Boost** Gain: \`${ctx.options.bass.db}dB\``);
                } catch {
                    return noFilter('Bass Boost');
                }
            }
            }
        } else {
            if (vc.id !== currentVc.channel.id) return this.creator.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
}

module.exports = CommandFilter;
