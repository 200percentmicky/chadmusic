/// ChadMusic
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

const { createLogger, format, transports } = require('winston');
const chalk = require('chalk');

// Winston Logger
const logger = createLogger({
    format: format.combine(
        format.splat(),
        format.timestamp(),
        format.label({ label: '==>' }),
        format.printf(({ timestamp, label, level, message }) => {
            return `[${timestamp}] ${label} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: 'console.log',
            level: 'silly',
            maxsize: 10 * 1000000
        })
    ]
});

if (process.env.USE_CONSOLE === 'true') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, label, level, message }) => {
                return `${chalk.black.cyan(`[${timestamp}]`)} ${label} ${level}: ${message}`;
            })
        ),
        level: 'silly'
    }));
}

module.exports = logger;
