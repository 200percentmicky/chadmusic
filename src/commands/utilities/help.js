/* eslint-disable no-var */
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { help } = require('../../aliases.json')

module.exports = class CommandHelp extends Command {
  constructor () {
    super(help !== undefined ? help[0] : 'help', {
      aliases: help || ['help'],
      description: {
        text: 'You\'re looking at it! Displays info about available commands.',
        usage: '[command]',
        details: '`[command]` The command you want to know more about. Shows you how to use its syntax and what permissions it requires to operate.'
      },
      category: '🛠 Utilities',
      args: [
        {
          id: 'string',
          match: 'content',
          default: null
        }
      ],
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message, args) {
    const string = args.string
    const command = this.handler.modules.get(string)

    if (string) {
      // The command has been found.
      if (this.handler.modules.has(string)) {
        const permissions = {
          CREATE_INSTANT_INVITE: 'Create Instant Invite',
          KICK_MEMBERS: 'Kick Members',
          BAN_MEMBERS: 'Ban Members',
          ADMINISTRATOR: 'Administrator',
          MANAGE_CHANNELS: 'Manage Channels',
          MANAGE_GUILD: 'Manage Server',
          ADD_REACTIONS: 'Add Reactions',
          VIEW_AUDIT_LOG: 'View Audit Log',
          PRIORITY_SPEAKER: 'Priority Speaker',
          STREAM: 'Video',
          VIEW_CHANNEL: 'Read Messages',
          SEND_MESSAGES: 'Send Messages',
          SEND_TTS_MESSAGES: 'Send TTS Messages',
          MANAGE_MESSAGES: 'Manage Messages',
          EMBED_LINKS: 'Embed Links',
          ATTACH_FILES: 'Attach Files',
          READ_MESSAGE_HISTORY: 'Read Message History',
          MENTION_EVERYONE: 'MENTION_EVERYONE',
          USE_EXTERNAL_EMOJIS: 'Use External Emojis',
          VIEW_GUILD_INSIGHTS: 'View Server Insights',
          CONNECT: 'Connect',
          SPEAK: 'Speak',
          MUTE_MEMBERS: 'Mute Members',
          DEAFEN_MEMBERS: 'Deafen Members',
          MOVE_MEMBERS: 'Move Members',
          USE_VAD: 'Use Voice Activity Detection',
          CHANGE_NICKNAME: 'Change Nickname',
          MANAGE_NICKNAMES: 'Manage Nicknames',
          MANAGE_ROLES: 'Manage Roles',
          MANAGE_WEBHOOKS: 'Manage Webhooks',
          MANAGE_EMOJIS: 'Manage Emojis'
        }

        const commandEmbed = new MessageEmbed()
          .setColor(this.client.color.blood)
          .setAuthor('PokiMusic Help Documentation', this.client.user.avatarURL({ dynamic: true }))
          .setTitle(`\`${this.client.config.prefix}${command.id}${command.description.usage ? ` ${command.description.usage}` : ''}\``)
          .addField(command.description.text, command.description.details ? command.description.details : '\u200b')
          .setTimestamp()
          .setFooter('<Required> • [Optional]', message.author.avatarURL({ dynamic: true }))
        if (command.ownerOnly) commandEmbed.addField('🚫 Owner Only', 'This command is for the bot owner only.')
        if (command.category) commandEmbed.addField('Category', command.category, true)
        // if (command.description.details) commandEmbed.addField('Details', `\`\`\`js\n${command.description.details}\`\`\``);
        if (command.aliases.length > 1) commandEmbed.addField('Aliases', command.aliases, true)

        // This gonna be a bruh moment.
        // It do be Yandere Simulator lol
        if (command.userPermissions) var userPerms = await command.userPermissions.map(user => permissions[user]).join(', ')
        if (command.clientPermissions) var clientPerms = await command.clientPermissions.map(client => permissions[client]).join(', ')
        const _uPerms = command.userPermissions ? `**User:** ${userPerms}\n` : ''
        const _bPerms = command.clientPermissions ? `**Bot:** ${clientPerms}` : ''
        if (userPerms || clientPerms) commandEmbed.addField('Permissions', `${_uPerms}${_bPerms}`)

        /*
        if (command.clientPermissions) {
          const clientPerms = await command.clientPermissions.map(client => permissions[client]).join(', ');
          commandEmbed.addField('Bot Permissions', clientPerms, true);
        } */

        return message.channel.send(commandEmbed)
      }
    }

    const helpEmbed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor(this.client.user.username + ' - PokiMusic Commands', this.client.user.avatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`To learn more about a command, use ${this.client.config.prefix}help [command]`)

    this.handler.categories.forEach((value, key) => {
      const field = {
        name: key,
        value: ''
      }
      value.forEach((commands) => {
        field.value += `\`${commands.id}\` `
      })
      field.value = `${field.value}`
      helpEmbed.fields.push(field)
    })
    message.react(this.client.emoji.okReact)
    return message.author.send(helpEmbed)
  }
}
