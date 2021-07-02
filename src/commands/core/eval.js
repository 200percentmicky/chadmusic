const { Command } = require('discord-akairo')

/* eslint-disable no-unused-vars */
const Discord = require('discord.js')
const dayjs = require('dayjs')
const moment = require('moment-timezone')
const _ = require('lodash')
const __ = require('underscore')
const prettyBytes = require('pretty-bytes')
const prettyMs = require('pretty-ms')
const colonNotation = require('colon-notation')
const commonTags = require('common-tags')

module.exports = class CommandEval extends Command {
  constructor () {
    super('jseval', {
      aliases: ['jseval'],
      ownerOnly: true,
      description: {
        text: 'Executes Javascript code.',
        usage: '<code>',
        details: commonTags.stripIndents`
        **Loaded Packages:**
        \`Discord\` - discord.js
        \`dayjs\` - day.js
        \`moment\` - moment-timezone
        \`_\` - lodash
        \`__\` - underscore
        \`prettyBytes\` - pretty-bytes
        \`prettyMs\` - prettyMs
        \`colonNotation\` - colon-notation
        \`commonTags\` - common-tags`
      },
      category: '💻 Core'
    })
  }

  async exec (message) {
    const t1 = process.hrtime()
    const clean = text => {
      if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) } else { return text }
    }

    const args = message.content.split(/ +/g)
    const code = args.slice(1).join(' ')

    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(await (async () => { return code })())

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled, { depth: 0, sorted: true, maxArrayLength: 5 })
      }

      const t2 = process.hrtime(t1)
      const end = (t2[0] * 1000000000 + t2[1]) / 1000000

      if (code.includes('.token')) {
        await message.react(process.env.REACTION_WARN)
        try {
          message.author.send(clean(evaled))
        } catch (err) {
          if (err.name === 'DiscordAPIError') return
        }
        return this.client.logger.info('Took %s ms. to complete.\n%d', end, clean(evaled))
      } else {
        const result = clean(evaled)
        if (result.length > 2000) {
          const compactResult = result.match(/.{1,1960}/g)
          for (const chunk of compactResult) {
            await message.channel.send(`\`\`\`js\n// ✅ Evaluated in ${end} ms.\n${chunk}\`\`\``)
          }
        } else {
          return message.channel.send(`\`\`\`js\n// ✅ Evaluated in ${end} ms.\n${result}\`\`\``)
        }
      }
    } catch (err) {
      message.channel.send(`\`\`\`js\n// ❌ Error during eval\n${err.name}: ${err.message}\`\`\``)
      const errorChannel = this.client.channels.cache.get('603735567733227531')
      const embed = new Discord.MessageEmbed()
        .setColor(process.env.COLOR_WARN)
        .setTitle(process.env.EMOJI_WARN + 'eval() Error')
        .setDescription(`Input: \`${code}\``)
        .addField('\u200b', `\`\`\`js\n${err.name}: ${err.message}\`\`\``)
        .setTimestamp()
      errorChannel.send({ embeds: [embed] })
    }
  }
}
