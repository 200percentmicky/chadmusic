const { Command } = require('discord-akairo');

module.exports = class CommandAddForumChannel extends Command {
  constructor () {
    super('addforumchannel', {
      aliases: ['addforumchannel', 'addforum'],
      category: '⚙ Settings',
      description: {
        text: 'Designates a channel as a forum channel.',
        usage: '[text_channel]',
        details: "`<text_channel>` The text channel to apply. Can be the current channel, a channel's mention, or the channel's ID."
      },
      userPermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
      clientPermissions: ['MANAGE_CHANNELS']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const forumArray = await this.client.settings.get(message.guild.id, 'forumChannels', []);
    if (args[1]) {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
      if (forumArray.includes(channel.id)) {
        return this.client.ui.reply(message, 'warn', `<#${channel.id}> is already a forum channel.`);
      }
      if (!channel) {
        return this.client.ui.reply(message, 'error', `\`${args[1]}\` is not a valid text channel.`);
      } else {
        forumArray.push(channel.id);
        await this.client.settings.set(message.guild.id, 'forumChannels', forumArray);
        return this.client.ui.reply(message, 'ok', `<#${channel.id}> is now a forum channel.`);
      }
    } else {
      if (forumArray.includes(message.channel.id)) {
        return this.client.ui.reply(message, 'warn', 'This channel is already a forum channel.');
      }
      forumArray.push(message.channel.id);
      await this.client.settings.set(message.guild.id, 'forumChannels', forumArray);
      return this.client.ui.reply(message, 'ok', 'This channel is now a forum channel.');
    }
  }
};
