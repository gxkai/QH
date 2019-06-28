const { FlowTool } = require('../model')
module.exports = {
  create: async req => {
    return FlowTool.create(req)
  },
  findByIdAndUpdate: async (id, req) => {
    return FlowTool.findByIdAndUpdate(id, req, { new: true })
  },
  findOneAndUpdate: async (f, u) => {
    return FlowTool.findOneAndUpdate(f, u, { new: true })
  },
  delete: async c => {
    return FlowTool.delete(c)
  },
  deleteById: async id => {
    return FlowTool.deleteById(id)
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
    return FlowTool.find(arr)
      .sort({ updatedAt: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  },
  findPageByFlowNode: async flowNode => {
    return FlowTool.find({ flowNode: flowNode, deleted: false })
  },
  findPageCount: async c => {
    return FlowTool.find(c).count()
  },
  find: async c => {
    return FlowTool.find(c)
  },
  findOne: async c => {
    return FlowTool.findById(c)
  },
  findById: async id => {
    return FlowTool.findById(id)
  }
}
