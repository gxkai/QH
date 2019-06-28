const { Bom } = require('../model')
module.exports = {
  findPage: async req => {
    let pageSize = req.pageSize
    let currentPage = req.currentPage
    let arr = Object.assign(req, {})
    for (let a in arr) {
      if (
        a === 'pageSize' ||
        a === 'currentPage' ||
        a === 'pagination' ||
        arr[a] === 'undefined' ||
        arr[a] === ''
      ) {
        delete arr[a]
      }
    }
    return Promise.all([
      Bom.find(arr)
        .sort({ updatedAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      Bom.find(arr).count()
    ])
  }
}
