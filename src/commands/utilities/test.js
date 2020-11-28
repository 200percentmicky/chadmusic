const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandTest extends Command
{
    constructor()
    {
        super('test', {
            aliases: ['test'],
            category: '🛠 Utilities',
            description: {
                text: 'Test command. Does I do work????'
            }
        });
    }

    async exec(message)
    {
        const text = "poggers".repeat(500);
        const arr = text.match(/.{1,2048}/g); // Build the array
          
        for (let chunk of arr) { // Loop through every element
            let embed = new MessageEmbed()
                .setColor(this.client.utils.randColor())
                .setDescription(chunk)
        
            await message.channel.send({ embed }); // Wait for the embed to be sent
        }
    }
};
