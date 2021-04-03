/* Index File */

require('dotenv').config()
const ChadMusic = require('./src/chadmusic.js')

new ChadMusic().login(process.env.TOKEN)
