const { ProductionLog } = require('../model')
module.exports = {
  findPage: async req => {
    let pageSize = req.pageSize
    let currentPage = req.currentPage
    let startTime = req.startTime
    let endTime = req.endTime
    let arr = {}
    if (startTime) {
      let timeArr = {
        startTime: startTime,
        endTime: endTime
      }
      arr = Object.assign(req, {
        createdAt: {
          $gte: timeArr.startTime,
          $lte: timeArr.endTime
        }
      })
    } else {
      arr = Object.assign(req, {})
    }
    for (let a in arr) {
      if (
        a === 'pageSize' ||
        a === 'currentPage' ||
        a === 'startTime' ||
        a === 'endTime' ||
        arr[a] === 'undefined' ||
        arr[a] === ''
      ) {
        delete arr[a]
      }
    }
    return Promise.all([
      ProductionLog.find(arr)
        .populate('line')
        .sort({ updatedAt: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(Number.parseInt(pageSize)),
      ProductionLog.find(arr).count()
    ])
  }
}
