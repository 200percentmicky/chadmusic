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

    // Daylight Savings Time Reminder.
    // Assumptions are for the US only. Will re-work to support internationally.
    const dstClock = moment(new Date()).tz(timezone)
    if (dstClock.isDST()) embed.addField(`ℹ Daylight Savings Time began on ${dstClock.format('dddd, MMMM D, YYYY')}.`, `The clock ${clock.get('M') === 2 ? 'advanced' : 'fell back'} one hour today.`)
    if (dstClock.add(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time will begin on ${dstClock.format('dddd, MMMM D, YYYY')}.`, `The clock will ${clock.get('M') === 2 ? 'advance' : 'fall back'} one hour on that day.`)
    if (dstClock.subtract(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time began on ${dstClock.format('dddd, MMMM D, YYYY')}.`, `The clock ${clock.get('M') === 2 ? 'advanced' : 'fell back'} one hour on that day.`)

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
