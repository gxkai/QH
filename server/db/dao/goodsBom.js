const { GoodsBom } = require('../model')
module.exports = {
  findPage: async req => {
    let pageSize = req.pageSize
    let currentPage = req.currentPage
    let arr = Object.assign(req, {
      deleted: false
    })
    for (let a in arr) {
      if (
        a === 'pageSize' ||
        a === 'currentPage' ||
        arr[a] === 'undefined' ||
        arr[a] === ''
      ) {
        delete arr[a]
      }
    }
    return Promise.all([
      GoodsBom.find(arr)
        .populate({
          path: 'goodsSpec',
          populate: {
            path: 'goods'
          }
        })
        .populate({
          path: 'subGoodsSpec',
          populate: {
            path: 'goods'
          }
        })
        .sort({ updatedAt: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      GoodsBom.find(arr).count()
    ])
  }
}
