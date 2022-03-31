const { Command } = require('discord-akairo');
const { toMilliseconds } = require('colon-notation');

module.exports = class CommandSeek extends Command {
    constructor () {
        super('seek', {
            aliases: ['seek'],
            description: {
                text: 'Sets the playing time of the track to a new position.',
                usage: '<time>',
                details: '`<time>` The time of the track to seek to.'
            },
            category: '🎶 Music'
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const args = message.content.split(/ +/g);

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');

        if (vc.members.size <= 2 || dj) {
            if (!args[1]) return this.client.ui.usage(message, 'seek <time>');
            try {
                const time = toMilliseconds(args[1]);
                this.client.player.seek(message.guild, parseInt(Math.floor(time / 1000)));
            } catch {
                this.client.ui.reply(message, 'error', 'Track time must be in colon notation. Example: `4:30`');
            }
            return message.react(process.env.REACTION_OK);
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
