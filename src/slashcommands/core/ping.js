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
    const client = this.creator.client;
    return ctx.send(`${process.env.EMOJI_OK} **Pong!** \`${Math.round(client.ws.ping)}ms.\``);
  }
}

module.exports = CommandPing;
