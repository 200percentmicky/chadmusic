const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
  id: {
    type: Object,
    required: true
  },
  settings: {
    type: Object,
    required: true
  }
}, { minimize: false })

module.exports = model('settings', guildSchema)
