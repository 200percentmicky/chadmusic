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

const { Command, Argument, AkairoClient } = require('discord-akairo'); // eslint-disable-line no-unused-vars
const { Client } = require('discord.js'); // eslint-disable-line no-unused-vars
const { CommandContext } = require('slash-create'); // eslint-disable-line no-unused-vars

/**
 * Used mainly for slash commands to run message based commands
 * attached to the Client.
 *
 * This function relies on slash-create and Discord Akairo.
 * @param {Client|AkairoClient} client Discord.JS Client attached to Akairo Client.
 * @param {CommandContext} string CommandContext
 * @param {Command|string} commandName The command attached to Akairo.
 * @param {Argument|Object} args Arguments passed to a command.
 */
async function handleCommand (client, ctx, commandName, args) {
    const command = client.commands.findCommand(commandName);
    return client.commands.runCommand(ctx, command, args);
}

module.exports = { handleCommand };
