const { SlashCommand } = require('slash-create');

class CommandPlay extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'play',
      description: 'Plays a song by URL, an attachment, or from a search result.'
    });

    this.filePath = __filename;
  }

  async run (ctx) {
    return ctx.send('a wip.');
  }
}

module.exports = CommandPlay;
