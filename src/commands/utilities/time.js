const { Command } = require('discord-akairo')
const moment = require('moment-timezone')
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')
const { MessageEmbed } = require('discord.js')

dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

module.exports = class CommandTime extends Command {
  constructor () {
    super('time', {
      aliases: ['time'],
      category: '🛠 Utilities',
      description: {
        text: 'Shows the current time on the server.'
      }
    })
  }

  async exec (message) {
    const timezone = this.client.settings.get(message.guild.id, 'timezone')
    const clock = dayjs(new Date()).tz(timezone)
    const time = clock.format('LT')
    const calendar = clock.format('dddd, MMMM D, YYYY')

    // Uses the correct emoji for the hour given.
    const emoji = {
      0: '🕛',
      1: '🕐',
      2: '🕑',
      3: '🕒',
      4: '🕓',
      5: '🕔',
      6: '🕕',
      7: '🕖',
      8: '🕗',
      9: '🕘',
      10: '🕙',
      11: '🕚',
      12: '🕛',
      13: '🕐',
      14: '🕑',
      15: '🕒',
      16: '🕓',
      17: '🕔',
      18: '🕕',
      19: '🕖',
      20: '🕗',
      21: '🕘',
      22: '🕙',
      23: '🕚'
    }

    const embed = new MessageEmbed()
      .setColor(message.guild.members.cache.get(this.client.user.id).displayColor)
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setDescription(`:calendar_spiral: ${calendar}\n${emoji[clock.hour()]} ${time}`)
      .setFooter(`Time Zone: ${timezone}`)

    // A stupid way to get the date of Daylight Savings Time.
    // TODO: I should look into a better way of handling this...
    if (clock.get('month') === 2) {
      const dstBegin = () => {
        let i
        const day = moment(new Date()).tz(timezone)
        for (i = 0; i < 7; i++) {
          day.add(i, 'days')
          const dst = day.isDST()
          if (dst) return day.format('dddd, MMMM D, YYYY')
        }
      }

      if (moment(new Date()).tz(timezone).isDST()) embed.addField(`ℹ Daylight Savings Time began on ${dstBegin()}.`, 'The clock advanced one hour today.')
      if (moment(new Date()).tz(timezone).add(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time will begin on ${dstBegin()}.`, 'The clock will advance one hour on that day.')
    }

    if (clock.get('month') === 10) {
      // Just like above, but parses the end of Daylight Savings Time
      const dstEnd = () => {
        let i
        const day = moment(new Date()).tz(timezone)
        for (i = 0; i < 7; i++) {
          day.add(i, 'days')
          const dst = day.isDST()
          if (!dst) return day.format('dddd, MMMM D, YYYY')
        }
      }

      if (!moment(new Date()).tz(timezone).isDST()) embed.addField(`ℹ Daylight Savings Time ended on ${dstEnd()}.`, 'The clock fell back one hour today.')
      if (!moment(new Date()).tz(timezone).add(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time will end on ${dstEnd()}.`, 'The clock will fall back one hour on that day.')
    }

    message.react(emoji[clock.hour()])
    return message.reply({
      embed: embed,
      allowedMentions: {
        repliedUser: true
      }
    }).then(msg => {
      setTimeout(() => {
        msg.delete()
      }, 10 * 1000)
    })
  }
}
