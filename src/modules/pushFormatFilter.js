/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

const { Queue } = require('distube'); // eslint-disable-line no-unused-vars
const _ = require('lodash');

/**
 * Creates a formatted list of currently active filters applied to the player.
 * @param {Queue} queue The player's current queue.
 * @param {string} name The name of the filter.
 * @param {string} value The human-readable value that the filter uses.
 * @returns {void}
 */
function pushFormatFilter (queue, name, value) {
    if (!queue) throw new Error('Queue is required.');
    if (!name) throw new Error('A filter name is required.');

    if (name === 'All') {
        queue.formattedFilters = [];
        return;
    }

    if (!value) throw new Error('A filter value is required.');

    const formatFilterArray = queue.formattedFilters;

    if (value === 'Off') {
        return _.remove(formatFilterArray, (x) => {
            return x.name === name;
        });
    }

    const matched = _.find(formatFilterArray, (x) => {
        return x.name === name;
    });

    if (matched) {
        _.remove(formatFilterArray, (x) => {
            return x.name === name;
        });
        return formatFilterArray.push({ name: name, value: value });
    } else {
        return formatFilterArray.push({ name: name, value: value });
    }
}

module.exports = { pushFormatFilter };
