require('dotenv').config()
const Deejay = require('./src/chadmusic.js')

new Deejay().login(process.env.TOKEN)
