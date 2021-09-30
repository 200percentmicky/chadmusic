const { Listener } = require('discord-akairo')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    // This is specific for my bot. It'll have no affect on your own.
    if (process.env.IS_POKI === 'true') {
      this.client.commands.remove('invite')
    }

    // Disbales the eval command is USE_EVAL is not 'true'.
    if (process.env.USE_EVAL !== 'true') {
      this.client.commands.remove('eval')
    }

    // Disables the shell command if USE_SHELL is not 'true'.
    if (process.env.USE_SHELL !== 'true') {
      this.client.commands.remove('shell')
    }

    this.client.logger.info('Logged in as %s (%d)', this.client.user.tag, this.client.user.id)
    this.client.logger.info('[Ready!<3♪] Let\'s party!!')
  }
}
