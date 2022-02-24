/* Index File */

require('dotenv').config();
const WaveBot = require('./src/bot.js');

new WaveBot().login(process.env.TOKEN);
