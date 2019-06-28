const { CheckRule } = require('../model')
module.exports = {
  create: async req => {
    return CheckRule.create(req)
  },
  update: async (c, u) => {
    return CheckRule.update(c, u, { new: true })
  },
  findOneAndUpdate: async (c, u) => {
    return CheckRule.findOneAndUpdate(c, u, { new: true })
  },
  delete: async c => {
    return CheckRule.delete(c)
  },
  findPage: async req => {
    let pageSize = req.pageSize
    let currentPage = req.currentPage
    let arr = Object.assign(req, {
      deleted: false,
      name: {
        $regex: req.name || ''
      }
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
    return CheckRule.find(arr)
      .sort({ updatedAt: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  },
  findPageCount: async req => {
    return CheckRule.find(arr).count()
  },
  findOne: async c => {
    return CheckRule.findOne(c)
  }
}
