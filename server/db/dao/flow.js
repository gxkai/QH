const { Flow } = require('../model')
module.exports = {
  create: async req => {
    return Flow.create(req)
  },
  update: async (id, req) => {
    return Flow.findByIdAndUpdate(id, req, { new: true })
  },
  delete: async id => {
    return Flow.update({ _id: id }, { deleted: true })
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
    return Flow.find(arr)
      .sort({ updatedAt: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  },
  findPageCount: async req => {
    return Flow.find(arr).count()
  },
  findOne: async c => {
    return Flow.findOne(c)
  },
  findById: async id => {
    return Flow.findById(id)
  }
}
