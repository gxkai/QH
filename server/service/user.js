const axios = require('axios')
module.exports = {
  async login({ ctx, openId }) {
    const { app } = ctx
    let user = await app.db.model.User.findOne({ openId })
    if (!user) {
      user = await app.db.model.User.create({
        openId
      })
    }
    const id = user._id
    const sessionKey = app.lib.util.encode(id)
    await app.db.model.User.findByIdAndUpdate(id, {
      lastLogin: Date.now()
    })
    return sessionKey
  },
  async findBySessionKey({ ctx, sessionKey }) {
    const { app } = ctx
    const { id, timespan } = app.lib.util.decode(sessionKey)
    // sessionKey expire 3d
    if (Date.now() - timespan > 1000 * 60 * 60 * 24 * 3) {
      return null
    }
    const users = await app.db.model.User.findById(id)
    return users
  }
}
