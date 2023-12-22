/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

const { Logger } = require('tslog');
const { appendFileSync } = require('node:fs');

// Winston Logger
const logger = new Logger({
    type: 'pretty',
    minLevel: process.env.DEBUG_LOGGING ? 0 : 3
});

logger.attachTransport((logObj) => {
    appendFileSync('console.log', `${logObj._meta.date} ${logObj._meta.logLevelName}   ${logObj._meta.path.fileNameWithLine}   ${logObj['0']}\n`);
});

module.exports = logger;
