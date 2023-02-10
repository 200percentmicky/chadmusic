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

const { SlashCommand } = require('slash-create');
const { handleCommand } = require('../../modules/handleCommand');

class CommandLicense extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'license',
            description: 'View this program\'s license.'
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        await ctx.defer(true);
        return handleCommand(this.client, ctx, 'license');
    }
}

module.exports = CommandLicense;
