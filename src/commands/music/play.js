const { Command } = require('discord-akairo');
const YouTube = require('youtube-sr');

module.exports = class CommandPlay extends Command
{
    constructor()
    {
        super('play', {
            aliases: ['play', 'p'],
            category: '🎶 Player',
            description: {
                text: 'Play\'s a song from a URL or search term.',
                usage: '<url/search>',
                details: '`<url/search>` The URL or search term to load.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const args = message.content.split(/ +/g);
        const text = args.slice(1).join(' ');

        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.');

        const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
        const pornRegex = new RegExp(pornPattern);
        if (text.match(pornRegex)) return message.forbidden('The URL you\'re requesting to play is not allowed.');

        message.channel.startTyping();
        const currentVc = this.client.voice.connections.get(message.guild.id);
        if (!currentVc)
        {
            const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT', 'SPEAK']);
            if (!permissions) return message.error(`Missing **Connect** or **Speak** permissions for **${vc.name}**`);    
            vc.join();
        } else {
            if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');
        }
        
        try {
            const urlPattern = /https?:\/\/(www\.)?(youtu(be)?)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
            const urlRegex = new RegExp(urlPattern);
            if (!text.match(urlRegex))
            {
                try {
                    const result = await YouTube.search(text, { limit: 1 });
                    await this.client.player.play(message, `https://youtu.be/${result[0].id}`);
                    message.react(this.client.emoji.okReact);
                } catch(err) {
                    return message.error(`No results found for \`${text}\``, 'Track Error');
                }
            } else {
                await this.client.player.play(message, text);
                message.react(this.client.emoji.okReact);
            }
        } catch(err) {
            message.error(err.message, 'Track Error');
        } finally {
            message.channel.stopTyping(true);
        }
        return;
    }
};
