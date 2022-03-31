const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require('discord.js');

class CommandSkip extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'skip',
            description: 'Skips the playing track.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'track',
                    description: 'Skips the playing track, or vote to skip if the voice channel has more than 3 people.'
                }
            ],
            guildIDs: [process.env.DEV_GUILD]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.user.id);

        const djMode = this.client.settings.get(guild.id, 'djMode');
        const djRole = this.client.settings.get(guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.creator.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = member.voice.channel;
        if (!vc) return this.creator.ui.send(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild);

        const currentVc = this.client.vc.get(vc);
        if (!queue || !currentVc) return this.creator.ui.send(ctx, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.creator.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size >= 4) {
            const vcSize = Math.floor(vc.members.size / 2);
            const neededVotes = queue.votes.length >= vcSize;
            const votesLeft = Math.floor(vcSize - queue.votes.length);
            if (queue.votes.includes(member.user.id)) return this.creator.ui.say(ctx, 'warn', 'You already voted to skip.');
            queue.votes.push(member.user.id);
            if (neededVotes) {
                queue.votes = [];
                if (!queue.songs[1]) {
                    this.client.player.stop(guild);
                    return this.creator.ui.custom(ctx, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
                }
                this.client.player.skip(guild);
                return this.creator.ui.custom(ctx, '⏭', process.env.COLOR_INFO, 'Skipped!');
            } else {
                const prefix = this.client.settings.get(guild.id, 'prefix', process.env.PREFIX);
                const embed = new MessageEmbed()
                    .setColor(parseInt(process.env.COLOR_INFO))
                    .setDescription('⏭ Skipping?')
                    .setFooter({
                        text: `${votesLeft} more vote${votesLeft === 1 ? '' : 's'} needed to skip.${dj ? ` Yo DJ, you can force skip the track by using '${prefix}forceskip'.` : ''}`,
                        icon_url: member.user.avatarURL({ dynamic: true })
                    });
                return ctx.send({ embeds: [embed] });
            }
        } else {
            queue.votes = [];
            if (!queue.songs[1]) {
                this.client.player.stop(guild);
                return this.creator.ui.custom(ctx, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
            }
            this.client.player.skip(guild);
            return this.creator.ui.custom(ctx, '⏭', process.env.COLOR_INFO, 'Skipped!');
        }
    }
}

module.exports = CommandSkip;
