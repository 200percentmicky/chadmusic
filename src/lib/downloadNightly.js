/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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

const { exec } = require('node:child_process');
const { resolve } = require('node:path');
const { type } = require('node:os');
const logger = require('./ChadLogger.js');

/**
 * Downloads the latest nightly build of yt-dlp.
 */
function downloadNightly () {
    const dir = resolve('node_modules/@distube/yt-dlp/bin');
    const bin = type() === 'Windows_NT' ? 'yt-dlp.exe' : './yt-dlp';
    const cmd = `cd ${dir} && ${bin} --update-to nightly`;

    logger.info('Downloading latest yt-dlp nightly build...');

    return exec(cmd, (error, stdout) => {
        if (error) {
            return logger.error(error.stack);
        }

        logger.info(stdout);
        logger.info('yt-dlp updated to latest nightly build.');
    });
}

module.exports = downloadNightly;
