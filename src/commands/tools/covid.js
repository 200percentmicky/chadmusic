const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const fetch = require('node-fetch')

module.exports = class CommandCovid extends Command {
  constructor () {
    super('covid', {
      aliases: ['covid', 'covid19', 'coronavirus'],
      category: '🔧 Tools',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        text: 'Used to get statistics about the on-going Covid-19 pandemic.'
      },
      cooldown: 10000
    })
  }

  async exec (message) {
    message.channel.startTyping()
    fetch('https://api.covid19api.com/summary', { method: 'GET' })
      .then(res => res.json())
      .then(json => {
        const embed = new MessageEmbed()
          .setColor(this.client.utils.randColor())
          .setTitle('☣ Covid-19 Statistics')
          .setThumbnail('https://cdn.discordapp.com/attachments/375453081631981568/702036051371491358/597px-SARS-CoV-2_without_background.png')
          .addField('Total Worldwide', stripIndents`
          **Cases:** ${json.Global.TotalConfirmed}
          **Deaths:** ${json.Global.TotalDeaths}
          **Recovered:** ${json.Global.TotalRecovered}
          `)
          .addField('Past 24 Hours', stripIndents`
          **Cases:** ${json.Global.NewConfirmed}
          **Deaths:** ${json.Global.NewDeaths}
          **Recovered:** ${json.Global.NewRecovered}
          `)
          .setFooter('Credit: covid19api.com')
        message.channel.send({ embed: embed })
      })
      .catch(err => {
        this.client.ui.say(message, 'error', `\`\`\`js${err}\`\`\``, '`Covid19Api Error`')
        return message.recordError('warning', 'covid', 'Covid19Api Error', err.stack)
      })
    return message.channel.stopTyping()
  }
}
