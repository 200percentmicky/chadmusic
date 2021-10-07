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
    return ctx.send(`${process.env.EMOJI_OK} **Pong!**`);
  }
}

module.exports = CommandPing;
