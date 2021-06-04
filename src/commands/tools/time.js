const { Command } = require('discord-akairo')
const moment = require('moment')
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
      category: '🔧 Tools',
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
      .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`:calendar_spiral: ${calendar}\n${emoji[clock.hour()]} ${time}`)
      .setFooter(`Time Zone: ${timezone}`)

    const days = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7
    }

    // Checks and parses a date to remind members when Daylight Savings Time will
    // begin and end, if the time zone utilizes Daylight Savings.
    // https://stackoverflow.com/questions/60023469/how-to-get-second-week-of-sunday-for-every-month-using-momentjs
    const nthDayOfMonth = (month, day, week) => {
      const m = month.tz(timezone).clone().startOf('month').day(day)
      if (m.month() !== month.month()) m.add(7, 'd')
      return m.add(7 * (week - 1), 'd') // The only difference is that the format will not be defined until after parsing.
    }

    if (clock.get('month') === (2 || 10)) {
      const a = clock
      const b = nthDayOfMonth(dayjs(new Date()), days.Sun, 2)
      embed.addField(`ℹ Daylight Savings Time will begin on ${b.format('dddd, MMMM D, YYYY')}.`, `The clock will ${clock.month('March') ? 'advance' : 'fall back'} one hour on that day.`)
      if (a.diff(b, 'days') === 0 && moment(new Date()).tz(timezone).isDST()) embed.addField(`ℹ Daylight Savings Time began on ${b.format('dddd, MMMM D, YYYY')}.`, `The clock ${clock.get('M') === 2 ? 'advanced' : 'fell back'} one hour today.`)
      if (a.diff(b, 'days') < 7 && moment(new Date()).tz(timezone).add(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time will begin on ${b.format('dddd, MMMM D, YYYY')}.`, `The clock will ${clock.get('M') === 2 ? 'advance' : 'fall back'} one hour on that day.`)
      if (a.diff(b, 'days') > -7 && moment(new Date()).tz(timezone).subtract(7, 'days').isDST()) embed.addField(`ℹ Daylight Savings Time began on ${b.format('dddd, MMMM D, YYYY')}.`, `The clock ${clock.get('M') === 2 ? 'advanced' : 'fell back'} one hour on that day.`)
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
