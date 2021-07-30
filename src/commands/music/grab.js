const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandGrab extends Command {
  constructor () {
    super('grab', {
      aliases: ['grab', 'save'],
      category: '🎶 Music',
      description: {
        text: 'Saves this song to your DMs.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    // Grab will not be affected by DJ Mode.
    const queue = this.client.player.getQueue(message)
    const song = queue.songs[0]

    try {
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor('Song saved!', 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png')
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField('Duration', `${song.formattedDuration}`)
        .setTimestamp()
      message.author.send({ embeds: [embed] })
      return message.react(process.env.REACTION_OK)
    } catch (err) {
      if (err.name === 'DiscordAPIError') this.client.ui.say(message, 'error', 'Unable to save this song. You are currently not accepting Direct Messages.')
    }
  }
}
