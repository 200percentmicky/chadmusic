const { Command } = require('discord-akairo');

/* eslint-disable padded-blocks */
/* eslint-disable no-multi-spaces */

module.exports = class CommandReload extends Command {
    constructor () {
        super('reload', {
            aliases: ['reload'],
            category: '💻 Core',
            description: {
                text: 'Reloads all of the bot\'s commands, listeners, and inhibitors.'
            },
            ownerOnly: true
        });
    }

    async exec (message) {
        try {
            message.channel.sendTyping();

            // Everything must be unloaded before we can move on.
            await this.client.commands.removeAll();   // Commands
            await this.client.inhibitors.removeAll(); // Inhibitors
            await this.client.listeners.removeAll();  // Listeners

            // Now we can load everything.
            this.client.commands.loadAll();
            this.client.inhibitors.loadAll();
            this.client.listeners.loadAll();

            message.channel.send({ content: '✅ All modules have been successfully reloaded.' });

            // Akario has a reloadAll() function, but this command was made specifically
            // for adding new commands, inhibitors, and listeners without fully restarting
            // the bot to apply new changes. Honestly, that process was getting on my damn
            // nerves. This is also a music bot, so any disruptions is gonna piss off someone.

        } catch (err) {
            if (err) return message.channel.send({ content: `❌ Error: \`${err}\`` });
        }
    }
};
