const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed, Permissions } = require('discord.js');

const pornPattern = (url) => {
    // ! TODO: Come up with a better regex lol
    // eslint-disable-next-line no-useless-escape
    const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
    const pornRegex = new RegExp(pornPattern);
    return url.match(pornRegex);
};

class CommandPlay extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'play',
            description: 'Plays a song by URL, an attachment, or from a search result.',
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'track',
                    required: true,
                    description: 'The track to play. You can use a URL of the track, or you can search or it.'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const client = this.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const djMode = client.settings.get(ctx.guildID, 'djMode');
        const djRole = client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.ctx(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        // if (!text && !message.attachments.first()) return client.ui.usage(message, 'play <url/search/attachment>');

        if (pornPattern(ctx.options.track)) return this.client.ui.ctx(ctx, 'no', "The URL you're requesting to play is not allowed.");

        await ctx.defer();

        const currentVc = client.vc.get(vc);
        if (!currentVc) {
            const permissions = vc.permissionsFor(client.user.id).has(Permissions.FLAGS.CONNECT);
            if (!permissions) return this.client.ui.send(ctx, 'MISSING_CONNECT', vc.id);

            if (vc.type === 'stage') {
                await client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
                const stageMod = vc.permissionsFor(client.user.id).has(Permissions.STAGE_MODERATOR);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(client.user.id).has(Permissions.FLAGS.REQUEST_TO_SPEAK);
                    if (!requestToSpeak) {
                        client.vc.leave(guild);
                        return this.client.ui.send(ctx, 'MISSING_SPEAK', vc.id);
                    } else if (guild.me.voice.suppress) {
                        await guild.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await guild.me.voice.setSuppressed(false);
                }
            } else {
                client.vc.join(vc);
            }
        } else {
            if (vc.id !== currentVc.channel.id) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = client.player.getQueue(guild.id);
        if (!queue) {
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:pWin95:538423887323594768> Starting Windows 98...')
                ]
            });
            await this.client.player.play(vc, 'https://cdn.discordapp.com/attachments/375453081631981568/944838120304693268/temmie98.wav', {
                member: _member,
                textChannel: channel
            });
        }

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await client.settings.get(guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === _member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.ctx(ctx, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            /* eslint-disable-next-line no-useless-escape */
            await client.player.play(vc, ctx.options.track.replace(/(^\<+|\>+$)/g, ''), {
                textChannel: channel,
                member: _member
            });
            return this.client.ui.ctxCustom(ctx, process.env.EMOJI_MUSIC, process.env.COLOR_MUSIC, `Requested \`${ctx.options.track}\``);
        } catch (err) {
            this.creator.logger.error(err.stack); // Just in case.
            return this.client.ui.ctx(ctx, 'error', `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error');
        }
    }
}

module.exports = CommandPlay;
