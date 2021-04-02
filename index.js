/* Index File */

require('dotenv').config()
const PokiMusic = require('./src/pokimusic.js')

new PokiMusic().login(process.env.TOKEN)
