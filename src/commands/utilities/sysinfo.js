const os = require('os')
const { Command } = require('discord-akairo')
const si = require('systeminformation')
const { stripIndents } = require('common-tags')
const prettyBytes = require('pretty-bytes')

const main = require('../../../package.json')
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package')
const distubeversion = require('../../../node_modules/distube/package')
const { italic } = require('chalk')

module.exports = class CommandSysInfo extends Command {
  constructor () {
    super('sysinfo', {
      aliases: ['sysinfo', 'jssysinfo', 'msysinfo'],
      category: '🛠 Utilities',
      description: {
        text: 'System statistics about the music bot.'
      }
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (args[1]) return
    message.channel.startTyping()
    const cpu = await si.cpu()
    const osSi = await si.osInfo()
    const memory = await si.mem()
    const user = os.userInfo()

    const data = stripIndents`
    === ChadMusic - The Chad Music Bot ===
              Client :: ${this.client.user.tag} (ID: ${this.client.user.id})
             Node.js :: ${process.version}
         Bot Version :: ${main.version}
          Discord.js :: ${discordversion.version}
    Akairo Framework :: ${akairoversion.version}
          DisTube.js :: ${distubeversion.version}
              Uptime :: ${this.client.utils.uptime()}

    # Hardware Specifications
              CPU :: ${cpu.manufacturer} ${cpu.brand} (${cpu.physicalCores} Cores / ${cpu.cores} Threads)
        CPU Speed :: ${cpu.speed} GHz.
     Memory Total :: ${prettyBytes(memory.total)}
      Memory Used :: ${prettyBytes(memory.used)}
      Memory Free :: ${prettyBytes(memory.free)}
       Swap Total :: ${prettyBytes(memory.swaptotal)}
        Swap Used :: ${prettyBytes(memory.swapused)}
        Swap Free :: ${prettyBytes(memory.swapfree)}

    # Operating System
          Platform :: ${osSi.platform}
        OS Version :: ${osSi.distro} ${osSi.release} ${osSi.platform === 'darwin' ? osSi.codename : ''}
            Kernel :: ${osSi.kernel}
     Architechture :: ${osSi.arch}
              User :: ${user.username}
             Shell :: ${user.shell}
      ${osSi.platform === 'win32' ? `Service Pack :: ${osSi.servicepack}` : ''}
    `

    message.channel.send(data, { code: 'asciidoc', split: true })
    return message.channel.stopTyping(true)
  }
}
