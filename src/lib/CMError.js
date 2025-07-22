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

/**
 * Error class for the bot to use.
 *
 * @param {string} [type]
 * @param {any} [metadata]
 * @param {string} [message]
 */

class CMError extends Error {
    constructor (type, metadata, message) {
        super();
        this.name = `CMError${type ? ` [${type}]` : ''}`;
        this.message = message ?? 'Failed successfully.'; // lol
        this.type = type;
        this.metadata = metadata;
    }
}

module.exports = CMError;
