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

/* eslint-disable no-unused-vars */
const { APIEmbed, Message, Client, ColorResolvable, RestOrArray, APIEmbedField } = require('discord.js');
const { Song } = require('distube');
const { CommandContext } = require('slash-create');
const { splitBar } = require('string-progressbar');
/* eslint-enable no-unused-vars */

/**
 * Class to construct a player embed window.
 */
class CMPlayerWindow {
    /**
     * @type {APIEmbed}
     */
    _embed = { description: '' };

    /**
     * @type {Array<string>}
     */
    _timeBar = undefined;

    /**
     * @type {boolean}
     */
    _isLive = false;

    /**
     * The color to apply to the embed.
     * @param {ColorResolvable|null} color
     */
    color (color) {
        this._embed.color = color;
        return this;
    }

    /**
     * The title of the embed window.
     * @param {string} name
     * @param {string|URL|null} iconURL
     */
    windowTitle (name, iconURL) {
        this._embed.author = { name, icon_url: iconURL };
        return this;
    }

    /**
     * The playing track's title.
     * @param {string} title
     */
    trackTitle (title) {
        this._embed.title = title.length > 256 ? title.substring(0, 252) + '...' : title;
        return this;
    }

    /**
     * The playing track's URL.
     * @param {string} url
     */
    trackURL (url) {
        this._embed.url = url;
        return this;
    }

    /**
     * Creates a progress bar for the playing track. Returns `undefined` if `isLive()` was used.
     * @param {Queue} queue
     * @param {number} total
     * @param {number} current
     * @param {number} length
     */
    timeBar (queue, total, current, length) {
        if (this._isLive === true) return;
        try {
            const progressBar = splitBar(total, current, length)[0];
            const currentTime = queue.formattedCurrentTime;
            const duration = queue.songs[0].formattedDuration;
            this._timeBar = `${currentTime} [${progressBar}] ${duration}`;
            this._embed.description += this._timeBar;
            return this;
        } catch (err) {
            console.log(err);
            this._embed.description += 'N/A';
            return this;
        }
    }

    /**
     * Designates that the track is a livestream. Returns `undefined` if `timeBar()` was used.
     */
    isLive () {
        if (this._timeBar) return;
        this._isLive = true;
        this._embed.description += '🔴 **Live**';
        return this;
    }

    /**
     * Applies the track's image, if one is present. Accepted sizes are "small" or "large".
     * @param {string} size
     * @param {string|URL} image
     */
    trackImage (size, image) {
        switch (size) {
        case 'small': {
            this._embed.thumbnail = { url: image };
            break;
        }

        case 'large': {
            this._embed.image = { url: image };
            break;
        }
        }

        return this;
    }

    /**
     * Adds embed fields to the embed window.
     * @param {RestOrArray<APIEmbedField>} fields
     */
    addFields (fields) {
        this._embed.fields = fields;
        return this;
    }

    /**
     * Sets the footer of the embed window.
     * @param {string} text
     * @param {string|URL|null} iconURL
     */
    setFooter (text, iconURL) {
        this._embed.footer = { text, icon_url: iconURL };
        return this;
    }

    /**
     * Adds a timestamp to the embed window.
     * @param {number|Date|null|undefined} timestamp
     */
    timestamp (timestamp) {
        this._embed.timestamp = timestamp ?? new Date();
        return this;
    }
}

module.exports = CMPlayerWindow;
