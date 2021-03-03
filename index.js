require('dotenv').config()
const Poki = require('./src/poki.js')

new Poki().login(process.env.TOKEN)
