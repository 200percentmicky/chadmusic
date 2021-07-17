const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
  id: {
    type: Object,
    required: true
  },
  modlog: {
    type: Object
  }
}, { minimize: false })

module.exports = model('modlog', guildSchema)
