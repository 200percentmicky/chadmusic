const { Listener } = require('discord-akairo');

module.exports = class ListenerInteractionCreate extends Listener {
  constructor () {
    super('interactionCreate', {
      emitter: 'client',
      event: 'interactionCreate'
    });
  }

  async exec (interaction) {
    switch (interaction.customId) {
      case 'test_button': {
        await interaction.update({ content: 'You clicked the button! 😎' });
        break;
      }
      case 'holy_shit': {
        await interaction.update({ content: '**WHAT THE FU💥💥💥**', components: [] });
        break;
      }
    }
  }
};
