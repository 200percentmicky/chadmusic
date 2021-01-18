const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandGrab extends Command {
  constructor () {
    super('grab', {
      aliases: ['grab', 'savesong', 'save'],
      category: '🎶 Player',
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
      message.author.send(new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor('Song saved!', 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png')
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField('Duration', song.formattedDuration)
        .setTimestamp()
      )
      return message.react(this.client.emoji.okReact)
    } catch (err) {
      message.say('error', 'I cannot save this song for you. You are currently not accepting Direct Messages.')
    }
  }
}
