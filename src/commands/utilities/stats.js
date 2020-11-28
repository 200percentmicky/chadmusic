const os = require('os');
const { Command } = require('discord-akairo');
const si = require('systeminformation');
const { stripIndents } = require('common-tags');
const prettyBytes = require('pretty-bytes');

const main = require('../../../package.json');
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');

module.exports = class CommandStats extends Command
{
    constructor()
    {
        super('stats', {
            aliases: ['stats'],
            category: '🛠 Utilities',
            description: {
                text: 'System statistics about the bot.'
            }
        });
    }

    async exec(message)
    {
        message.channel.startTyping();
        const cpu = await si.cpu();
        const osSi = await si.osInfo();
        const memory = await si.mem();
        const user = os.userInfo();

        const data = stripIndents`
        === ${this.client.user.username} - The Chad Music Bot ===
                 Node.js :: ${process.version}
             Bot Version :: ${main.version}
              Discord.js :: ${discordversion.version}
        Akairo Framework :: ${akairoversion.version}
                  Uptime :: ${this.client.utils.uptime()}

        # Hardware Specifications
                 CPU :: ${cpu.manufacturer} ${cpu.brand} (${cpu.physicalCores} Cores / ${cpu.cores} Threads)
           CPU Speed :: ${cpu.speed} GHz. (Max: ${cpu.speedmax} | Min: ${cpu.speedmin})
        Memory Total :: ${prettyBytes(memory.total)}
         Memory Used :: ${prettyBytes(memory.used)}
         Memory Free :: ${prettyBytes(memory.free)}
          Swap Total :: ${prettyBytes(memory.swaptotal)}
           Swap Used :: ${prettyBytes(memory.swapused)}
           Swap Free :: ${prettyBytes(memory.swapfree)}

        # Operating System
             Platform :: ${osSi.platform}
           OS Version :: ${osSi.distro} ${osSi.release} ${osSi.platform === 'darwin' ? osSi.codename : '' }
               Kernel :: ${osSi.kernel}
        Architechture :: ${osSi.arch}
                 User :: ${user.username}
                Shell :: ${user.shell}
        ${osSi.platform === 'win32' ? `Service Pack :: ${osSi.servicepack}` : '' }
        `;

        message.channel.send(data, { code: 'asciidoc', split: true });
        return message.channel.stopTyping(true);

    }
};
