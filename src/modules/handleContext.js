/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Client } = require('discord.js'); // eslint-disable-line no-unused-vars
const { CommandContext } = require('slash-create'); // eslint-disable-line no-unused-vars

/**
 * Adds information from Discord.js such as guild and channel objects to slash-create's
 * CommandContext interaction. This function also overrides the interaction's member
 * object, and overrides two Discord.js functions. (`<Message>.reply()` and `<Message>.react()`)
 *
 * This function relies on slash-create.
 * Will most likely be removed when the bot gets updated to Discord.js 15.
 * @param {Client} client Discord.JS Client
 * @param {CommandContext} ctx CommandContext interaction
 */
async function handleContext (client, ctx) {
    const guild = client.guilds.cache.get(ctx.guildID);

    let channel;
    let member;

    if (guild.available) {
        channel = guild.channels.cache.get(ctx.channelID);
        member = guild.members.cache.get(ctx.user.id);
    }

    // Override the reply function since it doesn't exist.
    const reply = (string) => {
        return ctx.send(string);
    };

    // Override reaction to return null since it doesn't exist.
    const react = () => { return null; };

    Object.assign(ctx, {
        guild: guild,
        channel: channel,
        member: member,
        reply: reply,
        react: react
    });
}

module.exports = { handleContext };
