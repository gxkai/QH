const { Workshop } = require('../model')
module.exports = {
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
    return Promise.all([
      Workshop.find(arr)
        .populate({
          path: 'factory',
          populate: {
            path: 'company'
          }
        })
        .sort({ updatedAt: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      Workshop.find(arr).count()
    ])
  }
}