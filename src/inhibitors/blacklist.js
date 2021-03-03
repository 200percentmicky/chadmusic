const { Inhibitor } = require('discord-akairo')
const fs = require('fs')

module.exports = class BlacklistInhibitor extends Inhibitor {
  constructor () {
    super('globalBlacklist', {
      reason: 'globalBlacklist',
      priority: 1
    })
  }

  exec (message) {
    const reddata = fs.readFileSync('../../../reddata/core/settings.json', { encoding: 'utf-8' })
    return reddata[0].GLOBAL.blacklist.includes(message.member.user.id)
  }
}
