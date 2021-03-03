const { Listener } = require('discord-akairo')

function NoInvites (content) {
  const invite = /(discord(app)?(\.com\/(invite)?|\.gg))\/[a-zA-Z0-9].{0,30}/gmi
  const regex = new RegExp(invite)
  return content.match(regex)
}

module.exports = class ListenerNoInvites extends Listener {
  constructor () {
    super('noInvites', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.channel.permissionsFor(message.member.user.id).has('MANAGE_MESSAGES')) return
    if (this.client.settings.get(message.guild.id).noInvites) {
      if (NoInvites(message.content)) {
        message.delete().then(msg => {
          msg.channel.send(`${message.member.user.toString()}, ${this.client.emoji.warn}Invite links are not allowed.`)
        })
      }
    }
  }
}
