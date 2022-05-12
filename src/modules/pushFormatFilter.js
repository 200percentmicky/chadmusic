const { Queue } = require('../../chadtube/dist'); // eslint-disable-line no-unused-vars
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
    if (!value) throw new Error('A filter value is required.');

    if (name === 'All') queue.formattedFilters = [];

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
