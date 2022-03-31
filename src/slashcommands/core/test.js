const { SlashCommand } = require('slash-create');

class CommandTest extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'test',
            description: 'Test command. Pay no heed.',
            guildIDs: [process.env.DEV_GUILD]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        return this.creator.ui.say(ctx, 'ok', 'Yay! I\'m working as I should! What was I suppose to do again? 😗');
    }
}

module.exports = CommandTest;
