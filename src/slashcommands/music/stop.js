const { SlashCommand } = require('slash-create');
const { Permissions } = require('discord.js');

class CommandStop extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'stop',
            description: 'Destroys the player.'
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const client = this.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const djMode = client.settings.get(ctx.guildID, 'djMode');
        const djRole = client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const vc = _member.voice.channel;
        const textChannel = client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', vc.id);
            }
        }

        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const currentVc = client.vc.get(vc);
        if (!client.player.getQueue(guild) || !currentVc) return this.client.ui.send(ctx, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size <= 2 || dj) {
            client.player.stop(guild);
            client.vc.leave(guild);
            return this.client.ui.ctxCustom(ctx, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
        } else {
            return this.client.ui.send(ctx, 'NO_DJ');
        }
    }
}

module.exports = CommandStop;
