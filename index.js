const PokiMusic = require('./src/pokimusic.js')
const { token } = require('./src/config.json')

new PokiMusic().login(token)
