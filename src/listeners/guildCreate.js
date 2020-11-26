const { stripIndents } = require('common-tags');
const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Message } = require('discord.js');
const Enmap = require('enmap');

module.exports = class ListenerGuildCreate extends Listener
{
    constructor()
    {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild)
    {
        const serverSize = this.client.guilds.cache.size == '1' ? `${this.client.guilds.cache.size} server` : `${this.client.guilds.cache.size} servers`;
        this.client.user.setActivity(`${this.client.config.prefix}help | Getting turnt in ${serverSize}.`)
		const defaults = {
			djMode: false,
			djRole: null,
			voiceChannel: null,
            textChannel: null,
            nowPlayingAlerts: true,
            maxTime: null, 
            maxQueueLimit: null
		};

        await this.client.settings.ensure(guild.id, defaults);

        var channel = guild.channels.cache.get(guild.systemChannelID);
        if (!channel) channel = guild.channels.cache.first();

        const enmap = new Enmap('sent');
        if (!enmap.has("guild_id", guild.id))
        {
            enmap.push("guild", guild.id);
            if (channel.type !== 'text') return;
            return channel.send(new MessageEmbed()
                .setColor(this.client.color.ok)
                .setAuthor('Thank you for inviting me to your server!', this.client.user.avatarURL({ dynamic: true }))
                .setDescription(stripIndents`
                - My prefix is \`${this.client.config.prefix}\`
                - Type \`${this.client.config.prefix}play\` to get this party started!
                - Join the [support server](${this.client.config.invite}) if you need assistance with the bot.
                - Have fun and enjoy!
                `)
                .setFooter('Deejay, the chad Music Bot.')
            );
        } else {
            return;
        }
    }

};
