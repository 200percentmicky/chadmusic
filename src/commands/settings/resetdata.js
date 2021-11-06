const { Command } = require('discord-akairo');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class CommandResetData extends Command {
  constructor () {
    super('resetdata', {
      aliases: ['resetdata'],
      category: '⚙ Settings',
      description: {
        text: 'Allows you to reset the bot\'s music settings for this server.'
      },
      channel: 'guild',
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async exec (message) {
    const yesButton = new MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Yes')
      .setEmoji(process.env.EMOJI_OK)
      .setCustomId('yes_data');

    const noButton = new MessageButton()
      .setStyle('DANGER')
      .setLabel('No')
      .setEmoji(process.env.EMOJI_ERROR)
      .setCustomId('no_data');

    const buttonRow = new MessageActionRow().addComponents(yesButton, noButton);

    const msg = await this.client.ui.reply(message, 'warn', 'You are about to revert the bot\'s settings for this server to defaults. Are you sure you want to do this?', 'Warning', null, [buttonRow]);

    const filter = interaction => interaction.user.id === message.author.id;

    const collector = await msg.createMessageComponentCollector({
      filter,
      componentType: 'BUTTON',
      time: 30000
    });

    collector.on('collect', async interaction => {
      if (interaction.customID === 'yes_data') {
        interaction.defer();
        await this.client.settings.clear(interaction.guild.id);
        collector.stop();
        this.client.ui.reply(message, 'ok', 'The settings for this server have been cleared.');
      }

      if (interaction.customID === 'no_data') {
        collector.stop();
      }
    });

    collector.on('end', () => {
      msg.delete();
      return message.react(process.env.REACTION_OK);
    });
  }
};
