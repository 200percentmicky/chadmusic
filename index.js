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

/* Index File */

require('dotenv').config();
const { ShardingManager } = require('discord.js');
const ChadMusic = require('./src/bot.js');
const logger = require('./src/modules/winstonLogger.js');

logger.info('Hello! Starting client...');

if (process.env.SHARDING) {
    const manager = new ShardingManager('./src/bot.js', {
        token: process.env.TOKEN,
        totalShards: parseInt(process.env.SHARDS) ?? 'auto'
    });

    manager.on('shardCreate', s => logger.info('Shard %s launched.', s.id));

    manager.spawn();
} else {
    logger.info('Starting client with sharding disabled.');
    new ChadMusic().login(process.env.TOKEN);
}
