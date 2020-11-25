const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked'
		});
	}

	async exec(message, command, reason) {
		console.log(`Command Blocked: ${reason}`);
		if (reason == 'owner') return message.forbidden('Only the bot owner can execute that command.');
		if (reason == 'guild') return message.error(`That command must be used in a server.`);
		if (reason == 'dm') return message.error(`That command must be used in a Direct Message.`);
	}
};
