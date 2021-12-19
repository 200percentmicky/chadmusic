const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandSetLog extends Command {
  constructor () {
    super('setlog', {
      aliases: ['setlog'],
      category: '⚙ Settings',
      description: {
        text: stripIndents`
        Allows you to set various logs and event alerts for the server.

        **Available Logs:**
        \`modlog\` Logs moderation actions.
        \`taglog\` Logs tags being created or deleted.

        **Available Events:**
        \`guildMemberAdd\` A user joins the server.
        \`guildMemberRemove\` A user leaves or was kicked from the server.
        \`guildMemberUpdate\` A member changes their nickname.
        \`messageDelete\` When a message has been deleted from the chat.
        \`messageUpdate\` When a message was edited in chat.
        \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.\n
        `,
        usage: '<log> [channel]',
        details: '`<log>` The type of log to set.\n`[channel]` A channel to set. If no channel is provided, uses the current channel this command was executed in. If "None" was used as the channel, disables the log for the server.'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);

    if (!args[1]) {
      const embed = new MessageEmbed()
        .setColor(parseInt(process.env.COLOR_INFO))
        .setTitle(process.env.EMOJI_INFO + ' Usage')
        .setDescription(stripIndents`
        \`setlog <log> [channel]\`

        **Available Logs:**
        \`modlog\` Logs moderation actions.
        \`taglog\` Logs tags being created or deleted.

        **Available Events:**
        \`guildMemberAdd\` A user joins the server.
        \`guildMemberRemove\` A user leaves or was kicked from the server.
        \`guildMemberUpdate\` A member changes their nickname.
        \`messageDelete\` When a message has been deleted from the chat.
        \`messageUpdate\` When a message was edited in chat.
        \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.
        `);
      return message.channel.send({ embeds: [embed] });
    }

    const logType = { // Again, pure lazy programming.
      modlog: 'Moderation logs',
      taglog: 'Tag logs',
      guildMemberAdd: '`guildMemberAdd`',
      guildMemberRemove: '`guildMemberRemove`',
      guildMemberUpdate: '`guildMemberUpdate`',
      messageDelete: '`messageDelete`',
      messageUpdate: '`messageUpdate`',
      voiceStateUpdate: '`voiceStateUpdate`'
    };

    if (!logType[args[1]]) {
      return this.client.ui.reply(message, 'warn', stripIndents`
            \`${args[1]}\` is not a valid log you can set.

            **Available Logs:**
            \`modlog\` Logs moderation actions.
            \`taglog\` Logs tags being created or deleted.

            **Available Events:**
            \`guildMemberAdd\` A user joins the server.
            \`guildMemberRemove\` A user leaves or was kicked from the server.
            \`guildMemberUpdate\` A member changes their nickname.
            \`messageDelete\` When a message has been deleted from the chat.
            \`messageUpdate\` When a message was edited in chat.
            \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.
            `);
    }

    // Use NONE to remove the log from the server.
    if (args[2] === 'NONE'.toLowerCase()) {
      await this.client.settings.delete(message.guild.id, args[1]);
      return this.client.ui.reply(message, 'ok', `${logType[args[1]]} will no longer be sent to a channel.`);
    }

    try {
      const channel = args[2] ? message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) : message.channel;
      await this.client.settings.set(message.guild.id, args[1], channel.id);
      return this.client.ui.reply(message, 'ok', `Added ${logType[args[1]]} to ${channel.toString()}.`);
    } catch (err) {
      this.client.ui.reply(message, 'error', err.message);
      return this.client.ui.recordError(this.client, 'setlog', '❌ Command Error', err.stack);
    }
  }
};
