const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class CommandUptime extends Command
{
    constructor()
    {
        super('uptime', {
            aliases: ['uptime'],
            category: '⚙ Utilities',
            description: 'Displays how long I\'ve been online for.'
        });
    }

    async exec(message)
    {
        String.prototype.toHHMMSS = function () {
            var timer = parseInt(this, 10);
            var days = Math.floor((timer % 31536000) / 86400);
            var hours = _.parseInt(timer / 3600) % 24;
            var minutes = _.parseInt(timer / 60) % 60;
            var seconds = Math.floor(timer % 60);
        
            if (days >= 1) {days = '0'+days;}
            if (hours < 10) {hours = '0'+hours;}
            if (minutes < 10) {minutes = '0'+minutes;}
            if (seconds < 10) {seconds = '0'+seconds;}
    
            var time = `${days} ${days == '1' ? 'day' : 'days'} : ${hours} ${hours == '01' ? 'hour' : 'hours'} : ${minutes} ${minutes == '01' ? 'minute' : 'minutes'} : ${seconds} ${seconds == '01' ? 'second' : 'seconds'}`;
            if (days == '0') time = `${hours} ${hours == '01' ? 'hour' : 'hours'} : ${minutes} ${minutes == '01' ? 'minute' : 'minutes'} : ${seconds} ${seconds == '01' ? 'second' : 'seconds'}`;
            if (hours == '00') time = `${minutes} ${minutes == '01' ? 'minute' : 'minutes'} : ${seconds} ${seconds == '01' ? 'second' : 'seconds'}`;
            if (minutes == '00') time = `${seconds} ${seconds == '01' ? 'second' : 'seconds'}`;
    
            return time;
        };
        
        var time = process.uptime();
        var uptime = (time + '').toHHMMSS();
        return message.channel.send(`🕓 **Uptime:** \`${uptime}\``);
    }
};
