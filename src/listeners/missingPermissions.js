const { Listener } = require('discord-akairo')

module.exports = class CommandMissingPermissions extends Listener {
  constructor () {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions'
    })
  }

  async exec (message, command, type, missing) {
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

    const clientPerms = await missing.map(missing => permissions[missing]).join(', ')
    const userPerms = await missing.map(missing => permissions[missing]).join(', ')

    if (type === 'client') {
      if (clientPerms.includes('Embed Links')) return message.error('Oh no! I can\'t run any commands in this channel! Please make sure that I have the **Embed Links** permission.')
      return message.warn(`**Required Permissions:** ${clientPerms}`, 'I don\'t have the permissions needed to run that command.')
    }

    if (type === 'user') {
      if (command.userPermissions === 'ADMINISTRATOR') return message.forbidden('Only server administrators can use that command.')
      else return message.forbidden(`**Required Permissions:** ${userPerms}`, 'You do not have permission to use this command.')
    }
  }
}
