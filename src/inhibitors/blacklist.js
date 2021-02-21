const { Inhibitor } = require('discord-akairo')
const fs = require('fs')

module.exports = class BlacklistInhibitor extends Inhibitor {
  constructor () {
    super('blacklist', {
      reason: 'blacklist',
      type: 'all'
    })
  }

  exec (message) {
    // Still a meanie!
    if (process.env.NODE_ENV !== 'production') return
    const settings = JSON.parse(fs.readFileSync('../../../reddata/core/settings.json', { encoding: 'utf-8' }))
    return settings[0].GLOBAL.blacklist.includes(message.author.id)
  }
}
