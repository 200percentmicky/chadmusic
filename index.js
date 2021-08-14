/* Index File */

require('dotenv').config()
const WaveBot = require('./src/bot.js')
const logger = require('./src/modules/winstonLogger')

logger.info('Loading libraries...')
new WaveBot().login(process.env.TOKEN)
