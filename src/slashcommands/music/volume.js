const { SlashCommand, CommandOptionType } = require('slash-create');
const { Permissions } = require('discord.js');

class CommandVolume extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'volume',
            description: 'Manages the volume, or displays the current volume of the player.',
            options: [{
                type: CommandOptionType.INTEGER,
                name: 'number',
                description: 'The number to set the volume to.'
            }]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.member.id);

        const djMode = this.client.settings.get(guild.id, 'djMode');
        const djRole = this.client.settings.get(guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild.id);
        if (!queue) return this.client.ui.send(ctx, 'NOT_PLAYING');

        const volume = queue.volume;
        if (!ctx.options.number) {
            const volumeEmoji = () => {
                const volumeIcon = {
                    50: '🔈',
                    100: '🔉',
                    150: '🔊'
                };
                if (volume >= 175) return '🔊😭👌';
                return volumeIcon[Math.round(volume / 50) * 50];
            };
            return this.client.ui.ctxCustom(ctx, volumeEmoji(), process.env.COLOR_INFO, `Current Volume: **${volume}%**`);
        } else {
            let newVolume = parseInt(ctx.options.number);
            const allowFreeVolume = await this.client.settings.get(guild.id, 'allowFreeVolume');
            if (allowFreeVolume === (false || undefined) && newVolume > 200) newVolume = 200;
            this.client.player.setVolume(guild.id, newVolume);

            if (newVolume >= 201) {
                return this.client.ui.ctx(
                    ctx,
                    'warn',
                    `Volume has been set to **${newVolume}%**.`,
                    null,
                    'Volumes exceeding 200% may cause damage to self and equipment.'
                );
            } else {
                return this.client.ui.ctx(ctx, 'ok', `Volume has been set to **${newVolume}%**.`);
            }
        }
    }
}

module.exports = CommandVolume;
