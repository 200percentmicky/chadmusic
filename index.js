const Deejay = require('./src/deejay.js')
const { token } = require('./src/config.json')

new Deejay().login(token)
