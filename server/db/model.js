const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model
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
const User = mongoose.Schema(
  {
    openId: {
      type: String,
      index: true,
      unique: true
    },
    userInfo: {
      avatarUrl: {
        type: String
      },
      city: {
        type: String
      },
      country: {
        type: String
      },
      gender: {
        type: Number
      },
      language: {
        type: String
      },
      nickName: {
        type: String
      },
      province: {
        type: String
      }
    },
    userType: {
      type: String,
      default: 'admin',
      enum: ['admin', 'blocked', 'ordinary']
    }
  },
  {
    collection: 'User'
  }
)

module.exports = {
  /*
  http 日志
   */
  Log: model('Log', Log),
  User: model('User', User)
}
