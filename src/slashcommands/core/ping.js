const { SlashCommand } = require('slash-create');

class CommandPing extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'ping',
            description: "Pong! Measures the bot's latency to Discord."
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        return ctx.send(`✅ **Pong!** \`${Math.round(this.client.ws.ping)}ms.\``);
    }
}

module.exports = CommandPing;
