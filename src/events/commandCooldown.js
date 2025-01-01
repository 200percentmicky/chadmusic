/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2025  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { Listener } = require('discord-akairo');
const { CommandHandlerEvent } = require('discord-akairo/dist/src/util/Constants');

module.exports = class ListenerCooldown extends Listener {
    constructor () {
        super('cooldown', {
            emitter: 'commandHandler',
            event: CommandHandlerEvent.COOLDOWN
        });
    }

    async exec (message, command, remaining) {
        if (command) {
            const seconds = remaining / 1000.00;
            const time = Math.floor(parseFloat(seconds));
            this.client.ui.custom(message, ':hourglass:', process.env.COLOR_NO, `You can run that command again in **${time}** seconds.`, 'Cooldown').then(sent => {
                setTimeout(() => {
                    sent.delete();
                }, 5000);
            });
        }
    }
};
