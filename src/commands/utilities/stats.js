const { Command } = require('discord-akairo');
const si = require('systeminformation');
const { stripIndents } = require('common-tags');

const main = require('../../../package.json');
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');

module.exports = class CommandStats extends Command
{
    constructor()
    {
        super('stats', {
            aliases: ['stats'],
            category: '⚙ Utilities',
            description: {
                text: 'System statistics about the bot.'
            }
        });
    }

    async exec(message)
    {
        message.channel.startTyping();
        const staticData = await si.getStaticData();
        const memory = await si.mem();
        const user = await si.users();

        // Thanks Stackoverflow lol 
        // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
        
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
            const i = Math.floor(Math.log(bytes) / Math.log(k));
        
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        const data = stripIndents`
        === ${this.client.user.username} - The Chad Music Bot ===
                 Node.js :: ${staticData.versions.node}
             Bot Version :: ${main.version}
              Discord.js :: ${discordversion.version}
        Akairo Framework :: ${akairoversion.version}
                  Uptime :: ${this.client.utils.uptime()}

        # Hardware Specifications
                 CPU :: ${staticData.cpu.manufacturer} ${staticData.cpu.brand} (${staticData.cpu.physicalCores} Cores / ${staticData.cpu.cores} Threads)
           CPU Speed :: ${staticData.cpu.speedmax} GHz.
        Memory Total :: ${formatBytes(memory.total)}
         Memory Used :: ${formatBytes(memory.used)}
         Memory Free :: ${formatBytes(memory.free)}
          Swap Total :: ${formatBytes(memory.swaptotal)}
           Swap Used :: ${formatBytes(memory.swapused)}
           Swap Free :: ${formatBytes(memory.swapfree)}

        # Operating System
             Platform :: ${staticData.os.platform}
           OS Version :: ${staticData.os.distro} ${staticData.os.release} ${staticData.os.codename}
               Kernel :: ${staticData.os.kernel}
        Architechture :: ${staticData.os.arch}
        `;

        message.channel.send(data, { code: 'asciidoc', split: true });
        return message.channel.stopTyping(true);

    }
};
