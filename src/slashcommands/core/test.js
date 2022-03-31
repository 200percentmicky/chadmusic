const { SlashCommand, CommandOptionType } = require('slash-create');

class CommandTest extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'test',
            description: 'Test command. Pay no heed.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'normal',
                    description: 'Just a normal test command. Also pay no heed.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'error',
                    description: 'bruh moment'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        switch (ctx.subcommands[0]) {
        case 'normal': {
            return this.client.ui.ctx(ctx, 'ok', 'Yay! I\'m working as I should! What was I suppose to do again? 😗');
        }

        case 'error': {
            const e = new Error('Successfully threw an error. How did I do? :3');
            e.name = 'GuruMeditationTest';
            throw e;
        }
        }
    }
}

module.exports = CommandTest;
