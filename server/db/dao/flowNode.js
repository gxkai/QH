const { FlowNode } = require('../model')
module.exports = {
  create: async req => {
    return FlowNode.create(req)
  },
  update: async (id, req) => {
    return FlowNode.findByIdAndUpdate(id, req, { new: true })
  },
  delete: async id => {
    return FlowNode.update({ _id: id }, { deleted: true })
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
    return FlowNode.find(arr)
      .sort({ updatedAt: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  },
  findPageByFlow: async flow => {
    return FlowNode.find({ flow: flow }).sort({ L: -1 })
  },
  findPageCount: async req => {
    return FlowNode.find(arr).count()
  },
  findOne: async id => {
    return FlowNode.findById(id)
  }
}
