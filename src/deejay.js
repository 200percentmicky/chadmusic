const { black } = require('chalk');
console.log(`${black.cyan('[ii]')} Loading libraries...`);

const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const prefix = require('discord-prefix');
const { Structures, MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const DisTube = require('distube');

const config = require('./config.json');
const emoji = require('./emoji.json');
const color = require('./colorcode.json');

/*
 * * Deejay - The Chad Music Bot created by Micky-kun
 */

/*
Here lies the messy outcome of a lazy programmer.
Either that or it's Javascripts fault.
*/

// Extending a few things...
Structures.extend('Message', Message => {
	class MessageStructure extends Message
	{
		// Custom embed messages.
		say(emoji, color, description, title)
		{
			let embed = new MessageEmbed()
				.setColor(color)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title
					? description 
					: emoji
						? `${emoji} ${description}`
						: description
				);

			if (title) embed.setTitle(emoji
				? `${emoji} ${title}`
				: title
			);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? emoji
							? `${emoji} **${title}**\n>>> ${description}`
							: `**${title}**\n>>> ${description}`
						: emoji
							? `${emoji} ${description}`
							: description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// OK Dialog
		ok(description, title)
		{
			let embed = new MessageEmbed()
				.setColor(color.ok)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title ? description : emoji.ok + description);

			if (title) embed.setTitle(emoji.ok + title);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? `${emoji.ok} **${title}**\n>>> ${description}`
						: emoji.ok + description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// Warning Dialog
		warn(description, title)
		{			
			let embed = new MessageEmbed()
				.setColor(color.warn)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title ? description : emoji.warn + description);

			if (title) embed.setTitle(emoji.warn + title);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? `${emoji.warn} **${title}**\n>>> ${description}`
						: emoji.warn + description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// Error Dialog
		error(description, title)
		{
			let embed = new MessageEmbed()
				.setColor(color.error)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title ? description : emoji.error + description);

			if (title) embed.setTitle(emoji.error + title);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? `${emoji.error} **${title}**\n>>> ${description}`
						: emoji.error + description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// Information Dialog
		info(description, title)
		{
			let embed = new MessageEmbed()
				.setColor(color.info)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title ? description : emoji.info + description);

			if (title) embed.setTitle(emoji.info + title);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? `${emoji.info} **${title}**\n>>> ${description}`
						: emoji.info + description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// Forbidden Dialog
		forbidden(description, title)
		{
			let embed = new MessageEmbed()
				.setColor(color.no)
				//.setAuthor(this.author.tag, this.author.avatarURL({ dynamic: true }))
				.setDescription(title ? description : emoji.no + description);

			if (title) embed.setTitle(emoji.no + title);

			if (this.channel.type == 'dm')
			{
				return this.channel.send(embed);
			} else {
				if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']))
				{
					return this.channel.send(title
						? `${emoji.no} **${title}**\n>>> ${description}`
						: emoji.no + description
					);
				}
				else return this.channel.send(embed);
			}
		}

		// Error Handling. Used to send to the support server.
		async recordError(type, command, title, error)
		{
			const errorChannel = this.client.channels.cache.get('603735567733227531');
			let embed = new MessageEmbed()
				.setTimestamp()
				.addField('Server', this.channel.type == 'dm' ? 'Direct Message' : this.guild.name + '\nID: ' + this.guild.id, true)
				.addField('Channel', this.channel.type == 'dm' ? 'Direct Message' : this.channel.name + '\nID: ' + this.channel.id, true);

			if (command)
			{
				embed.addField('Command', command, true); // I don't know how to really get which command triggered it. So why not hard code it? lol
			}

			if (type == 'warning')
			{
				console.log(this.client.warnlog + error);
				embed.setColor(color.warn);
				embed.setTitle(emoji.warn + title);
			}

			if (type == 'error')
			{
				console.log(this.client.errlog + error);
				embed.setColor(color.error);
				embed.setTitle(emoji.error + title);
			}

			await errorChannel.send(embed);
			return errorChannel.send(error, { code: 'js', split: true });
		}

	}

	return MessageStructure;
});

class Deejay extends AkairoClient
{
	constructor()
	{
		super({
			ownerID: config.owner
		}, {
			disableMentions: 'true'
		});

		// Logging with some chalk. :)
		this.infolog = `${black.cyan('[ii]')} `;
		this.errlog = `${black.red('[XX]')} `;
		this.warnlog = `${black.yellow('[!!]')} `;
		this.debuglog = `${black.green('[##]')} `;

		// Configuration files.
		this.config = config;
		this.emoji = emoji;
		this.color = color;

		// Packages
		this.utils = require('bot-utils');
		this.moment = require('moment');
		this.prefix = prefix;
		this.si = require('systeminformation');
		this.player = new DisTube(this, {
			emitNewSongOnly: true,
			leaveOnStop: true,
			leaveOnEmpty: true,
			leaveOnFinish: true,
			youtubeCookie: config.ytCookie,
			youtubeDL: true,
			updateYouTubeDL: false,
			customFilters: {
				vibrato: "vibrato=f=7:d=1",
				demonic: "vibrato=f=2500:d=1"
			}
		});

	
		console.log(this.infolog + 'Loading settings...');
		this.settings = new Enmap({
			name: 'settings'
		});

		this.commands = new CommandHandler(this, {
			directory: './src/commands',
			prefix: message => message.channel.type == 'text' ? prefix.getPrefix(message.guild.id) || config.prefix : config.prefix,
			commandUtil: true,
			handleEdits: true,
			allowMention: true
		});
		this.listeners = new ListenerHandler(this, {
			directory: './src/listeners'
		});

		this.listeners.setEmitters({
			process: process,
			commandHandler: this.commands,
			player: this.player
		});

		this.commands.useInhibitorHandler(this.inhibitors);
		this.commands.useListenerHandler(this.listeners);

		this.commands.loadAll();
		this.listeners.loadAll();

	}
}

module.exports = Deejay;
