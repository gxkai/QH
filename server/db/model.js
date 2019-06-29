const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Log = new Schema(
  {
    projectName: {
      type: String
    },
    serverIp: {
      type: String
    },
    method: {
      type: String
    },
    url: {
      type: String
    },
    host: {
      type: String
    },
    message: {
      type: Object
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Log'
  }
)

module.exports = {
  /*
  http 日志
   */
  Log: mongoose.model('Log', Log)
}
