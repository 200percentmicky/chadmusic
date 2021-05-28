/* Index File */

require('dotenv').config()
const WaveBot = require('./src/wavebot.js')

new WaveBot().login(process.env.TOKEN)
