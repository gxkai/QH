const mongoose = require('mongoose')
module.exports = {
  open() {
    try {
      const url = `mongodb://139.196.102.55:37017,139.196.102.55:47017,139.196.102.55:57017/mes`
      const user = ``
      const password = ``
      console.log(process.env.NODE_ENV, process.env.HTTP_URL)
      if (process.env.NODE_ENV === 'development') {
        console.log(`测试环境开启debug模式`)
        mongoose.set('debug', true)
      }
      mongoose.connect(url, {
        replset: { rs_name: 'rs' }
      })
      mongoose.plugin(require(`./plugin`).lastModified)
      const db = mongoose.connection
      db.on('error', error => {
        console.log(`MongoDB connecting failed: ${error}`)
      })
      db.once('open', () => {
        console.log('MongoDB connecting succeeded')
      })
      return db
    } catch (e) {
      console.log(`MongoDB connecting failed: ${e}`)
    }
  },
  close() {
    return mongoose.connection.close()
  }
}
